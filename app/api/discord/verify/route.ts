import { createAdminClient } from '@/lib/supabase/admin'
import { discordVerifySchema } from '@/lib/validations/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        let body
        try{
            body = await request.json()
        } catch {
            return NextResponse.json({ verified: false, message: 'Invalid request body' }, { status: 400 })
        }

        const validation = discordVerifySchema.safeParse(body)
        if (!validation.success){
            return NextResponse.json({verified: false, message: 'Validation failed', details: validation.error.flatten().fieldErrors }, { status: 400 })
        }

        const { email, serverGender } = validation.data

        // Verify secret key to prevent unauthorized access
        const botSecret = request.headers.get('X-Bot-Secret')
        
        if (botSecret !== process.env.DISCORD_BOT_SECRET) {
             return NextResponse.json({ 
                verified: false,
                message: 'Unauthorized' 
            }, { status: 401 })
        }

        const supabase = createAdminClient()

        // Look up member in database
        const { data: member, error } = await supabase
            .from('members')
            .select('id, full_name, student_id, gender, role, position, is_active')
            .eq('email', email.toLowerCase())
            .eq('is_active', true)
            .single()

        if (error || !member) {
            return NextResponse.json({
                verified: false,
                message: 'Email not found in our database or account is inactive. Please contact an officer.'
            })
        }

        // Check gender matches server
        if (member.gender !== serverGender) {
            return NextResponse.json({
                verified: false,
                message: `This email is registered for the ${member.gender} division. Please join the correct server.`
            })
        }

        return NextResponse.json({
            verified: true,
            member: {
                name: member.full_name,
                studentId: member.student_id,
                role: member.role,
                position: member.position
            }
        })
    } catch (error) {
        console.error('Discord verification error:', error)
        return NextResponse.json({
            verified: false,
            message: 'An error occurred during verification. Please try again.'
        }, { status: 500 })
    }
}