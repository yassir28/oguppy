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


export async function GET(request) {
    try{
        const units =await prisma.unit.findMany({
            orderBy: {
                createdAt: 'desc'
            },
        });
        return NextResponse.json(units)
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


export async function DELETE(request) {
    try{
        const id = request.nextUrl.searchParams.get("id")
        const  deleteUnit = await prisma.unit.delete({
        where:{
                id
            }
       });        
        return NextResponse.json(deleteUnit)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to delete the unit"
        },{
            status:500
        })
    }
}