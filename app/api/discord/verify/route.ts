import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { email, discordId, serverGender } = await request.json()

        console.log("=== ALL HEADERS ===")
        request.headers.forEach((value, key) => {
            console.log(`${key}: ${value}`)
        })
        console.log("=== END HEADERS ===")

        // Verify secret key to prevent unauthorized access
        const authHeader = request.headers.get('authorization')
        const authHeaderLower = request.headers.get('Authorization')  // Capital A
        const authHeaderUpper = request.headers.get('AUTHORIZATION')  // All caps
    
        console.log('=== AUTH HEADER VARIATIONS ===')
        console.log('authorization (lowercase):', authHeader)
        console.log('Authorization (capital A):', authHeaderLower)
        console.log('AUTHORIZATION (uppercase):', authHeaderUpper)
        console.log('=== END VARIATIONS ===')

        const expectedAuth = `Bearer ${process.env.DISCORD_BOT_SECRET}`

        console.log('=== API AUTH DEBUG ===')
        console.log('Received header:', JSON.stringify(authHeader))
        console.log('Expected header:', JSON.stringify(expectedAuth))
        console.log('Received length:', authHeader?.length)
        console.log('Expected length:', expectedAuth.length)
        console.log('Secret from env:', JSON.stringify(process.env.DISCORD_BOT_SECRET))
        console.log('Secret length:', process.env.DISCORD_BOT_SECRET?.length)
        console.log('Match:', authHeader === expectedAuth)
        console.log('=== END DEBUG ===')

        if (authHeader !== expectedAuth) {
            console.log('AUTH FAILED - Returning 401')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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