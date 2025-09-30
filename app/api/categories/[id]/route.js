import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    try{
        const { id } = await params;
        const category =await prisma.category.findUnique({
            where: {
                id
            },
        });
        return NextResponse.json(category)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch a category"
        },{
            status:500
        })
    }
}

export async function PUT(request, {params}) {
    try{
        const { id } = await params;
        const  {title, description} = await request.json()
        const category =await prisma.category.update({
            where: {
                id
            },
            data:{
                title, description
            }
        });
        return NextResponse.json(category)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to update the category"
        },{
            status:500
        })
    }
}