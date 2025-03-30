export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username"); 

    if (!username) {
        return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    try {
        const response = await fetch(`https://leetcode.com/${username}/`);
        if (!response.ok) {
            throw new Error("User not found");
        }
        const data = await response.text();
        console.log(data);
        
        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
}