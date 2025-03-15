import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
    try{
        const body = await request.json();
        const {title, abbreviation} = body;

        const unit= await prisma.unit.create({
            data: {
                title:title,
                abbreviation:abbreviation
            }
        })
        console.log(unit)
        return NextResponse.json(unit, { status: 201 })
    }
    catch (error){
        console.error('Error creating unit:', error);
        return NextResponse.json({
            error: error.message,
            message:"Failed to create a unit"
        },{
            status:500
        })
    }
}