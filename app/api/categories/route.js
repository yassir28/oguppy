import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try{
        const body = await request.json();
        const { title, description } = body;

        const  category = await prisma.category.create({
        data:{
                title:title,
                description:description
            }
       });
        console.log(category)
        return NextResponse.json(category)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to create a category"
        },{
            status:500
        })
    }
}



export async function GET(request) {
    try{
        const categories =await prisma.category.findMany({
            orderBy: {
                createdAt: 'desc'
            },
        });
        return NextResponse.json(categories)
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





export async function DELETE(request) {
    try{
        const id = request.nextUrl.searchParams.get("id")
        const  deleteCategory = await prisma.category.delete({
        where:{
                id
            }
       });        
        return NextResponse.json(deleteCategory)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to delete the category"
        },{
            status:500
        })
    }
}