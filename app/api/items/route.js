import { NextResponse } from "next/server";

export async function POST(request) {
    try{
        {/*
                    const item= {
            title, categoryId, 
            SKU, Barcode,
            Qty,UnitId,BrandId,
            SellingPrice,ReorderPoint,
            WarehouseId,weight,dimensions,
            taxRate,Notes
        }
*/}
        const  data  = await request.json();
        console.log(data)
        return NextResponse.json(data)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to create a item"
        },{
            status:500
        })
    }
}