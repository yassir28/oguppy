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


