import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    try{
        const { id } = await params;
        const brands =await prisma.brand.findUnique({
            where: {
                id
            },
        });
        return NextResponse.json(brands)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch a brand"
        },{
            status:500
        })
    }
}

export async function PUT(request, {params}) {
    try{
        const { id } = await params;
        const  {title} = await request.json()
        const brands =await prisma.brand.update({
            where: {
                id
            },
            data:{
                title
            }
        });
        return NextResponse.json(brands)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to update the brand"
        },{
            status:500
        })
    }
}