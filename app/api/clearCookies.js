import {cookies} from "next/headers";


export const dynamic = 'force-dynamic' // defaults to force-static

export async function GET() {

    // CLEAR THE COOKIE
    cookies().delete("token");
    cookies().delete("role");
    // RETURN SUCCESS
    return Response.json({success: true}, {status: 201});
}