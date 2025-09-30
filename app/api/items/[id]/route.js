import { NextResponse } from "next/server";

export async function GET(request, {params}) {
    try{
        const { id } = await params;
        const item =await prisma.item.findUnique({
            where: {
                id
            },
        });
        return NextResponse.json(item)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to Fetch a item"
        },{
            status:500
        })
    }
}

export async function PUT(request, {params}) {
    try{
        const { id } = await params;
        const  {imageUrl,title,  sku, barcode,  qty, sellingPrice, weight,dimensions, taxRate,notes} = await request.json()

                    
        const item =await prisma.item.update({
            where: {
                id
            },
            data:{ // db: front
                imageUrl,
                title: title,
                sku: sku,
                barcode: barcode,
                quantity: parseInt(qty), 
                sellingPrice: parseFloat(sellingPrice),
                weight: weight ? parseFloat(weight) : null,
                dimensions: dimensions,
                taxRate: parseFloat(taxRate),
                notes: notes,
            }
        });
        return NextResponse.json(item)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to update the item"
        },{
            status:500
        })
    }
}