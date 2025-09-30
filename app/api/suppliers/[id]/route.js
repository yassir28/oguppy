import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    try{
        const { id } = await params;
        const suppliers =await prisma.supplier.findUnique({
            where: {
                id
            },
        });
        return NextResponse.json(suppliers)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch a supplier"
        },{
            status:500
        })
    }
}

export async function PUT(request, {params}) {
    try{
        const { id } = await params;
        const  {title, supplierCode} = await request.json()
        const suppliers =await prisma.supplier.update({
            where: {
                id
            },
            data:{
                title, supplierCode
            }
        });
        return NextResponse.json(suppliers)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to update the supplier"
        },{
            status:500
        })
    }
}