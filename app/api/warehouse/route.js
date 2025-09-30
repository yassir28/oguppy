import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try{
        const {title, location, type, description} = await request.json();

        const warehouse= await prisma.warehouse.create({
            data:{
                title:title,
                location:location, 
                description:description,
                warehouseType:type
            }
        })

        return NextResponse.json(warehouse)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to create a warehouse"
        },{
            status:500
        })
    }
}


export async function GET(request) {
    try{
        const warehouse =await prisma.warehouse.findMany({
            
            orderBy: {
                createdAt: 'desc'
            },
            include:{
                items:true
            }
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




export async function DELETE(request) {
    try{
        const id = request.nextUrl.searchParams.get("id")
        const  deleteWarehouse = await prisma.warehouse.delete({
        where:{
                id
            },
        //  iclude:{
        //      item:true
          // }
       });        
        return NextResponse.json(deleteWarehouse)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to delete the warehouse"
        },{
            status:500
        })
    }
}