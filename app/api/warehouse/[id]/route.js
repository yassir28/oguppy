import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    try{
        const { id } = await params;
        const warehouse =await prisma.warehouse.findUnique({
            where: {
                id
            },
        });
        return NextResponse.json(warehouse)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch a warehouse"
        },{
            status:500
        })
    }
}

export async function PUT(request, {params}) {
    try{
        const { id } = await params;
        const  {title, location, warehouseType} = await request.json()
        const warehouse =await prisma.warehouse.update({
            where: {
                id
            },
            data:{
                title, location, warehouseType
            }
        });
        // ✅ Reindex all items in this category (title might have changed)
        await reindexItemsByRelation('warehouseId', id);

        return NextResponse.json(warehouse)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to update the warehouse"
        },{
            status:500
        })
    }
}