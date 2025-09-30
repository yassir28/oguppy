import { NextResponse } from "next/server";

export async function POST(request) {
    try{
        const body = await request.json();
        const {title,updatedAt, supplierCode} = body;
        
        //const supplier= {title}

        const  supplier = await prisma.supplier.create({
        data:{
                title:title,
                supplierCode:supplierCode,
                updatedAt

            }
       });


        console.log(supplier)
        return NextResponse.json(supplier)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to create a supplier"
        },{
            status:500
        })
    }
}





export async function GET(request) {
    try{
        const brands =await prisma.supplier.findMany({
            orderBy: {
                createdAt: 'desc'
            },
        });
        return NextResponse.json(brands)
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



export async function DELETE(request) {
    try{
        const id = request.nextUrl.searchParams.get("id")
        const  deleteBrand = await prisma.supplier.delete({
        where:{
                id
            }
       });        
        return NextResponse.json(deleteBrand)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to delete the supplier"
        },{
            status:500
        })
    }
}