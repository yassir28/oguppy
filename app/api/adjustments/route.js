import { NextResponse } from "next/server";

export async function POST(request) {
    try{
        const body = await request.json();
        const {title} = body;
        
        //const brand= {title}

        const  brand = await prisma.brand.create({
        data:{
                title:title
            }
       });


        console.log(brand)
        return NextResponse.json(brand)
    }
    catch (error){
        console.log(error)
        return NextResponse.json({
            error,
            message:"Failed to create a brand"
        },{
            status:500
        })
    }
}





export async function GET(request) {
    try{
        const brands =await prisma.brand.findMany({
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
            message:"Failed to Fetch a brand"
        },{
            status:500
        })
    }
}