import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    try{
        const { id } = await params;
        const unit =await prisma.unit.findUnique({
            where: {
                id
            },
        });
        return NextResponse.json(unit)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch a unit"
        },{
            status:500
        })
    }
}

export async function PUT(request, {params}) {
    try{
        const { id } = await params;
        const  {title, abbreviation} = await request.json()
        const units =await prisma.unit.update({
            where: {
                id
            },
            data:{
                title, abbreviation
            }
        });
        return NextResponse.json(units)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to update the unit"
        },{
            status:500
        })
    }
}