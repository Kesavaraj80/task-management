import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const userId = session.user.id;

  const data = await req.json();

  const { title, description, status, priority, dueDate } = data;

  try {
    console.log("inside task");
    await prisma.task.create({
      data: {
        title: title,
        description: description,
        status: status,
        priority: priority,
        dueDate: dueDate,
        userId: userId || "",
      },
    });

    return NextResponse.json(
      { message: "Task Created Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);

    return NextResponse.json(
      { message: "Task creation failed" },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const url = new URL(req.url);
    const sort = url.searchParams.get("sort");
    const status = url.searchParams.get("status");
    const dueDate = url.searchParams.get("dueDate");
    const priority = url.searchParams.get("priority");

    console.log(status, dueDate, priority);
    let query: Record<string, any> = {};

    if (status) query["status"] = status;
    if (priority) query["priority"] = priority;
    if (dueDate) query["dueDate"] = new Date(dueDate);

    const orderBy:
      | Prisma.TaskOrderByWithRelationInput
      | Prisma.TaskOrderByWithRelationInput[]
      | undefined = { dueDate: sort === "dueDate_asc" ? "asc" : "desc" };

    const data = await prisma.task.findMany({
      where: query,
      orderBy,
    });

    return NextResponse.json({ tasks: data }, { status: 200 });
  } catch (error) {
    console.error("Error creating task:", error);

    return NextResponse.json({ message: "Task fetch failed" }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    const userId = session.user.id;
    const data = await req.json();

    const { id, title, description, status, priority, dueDate } = data;

    if (!id || id.trim() === "") {
      return new Response(JSON.stringify({ message: "Task ID is required" }), {
        status: 400,
      });
    }

    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return new Response(JSON.stringify({ message: "Task not found" }), {
        status: 404,
      });
    }

    if (existingTask.userId !== userId) {
      return new Response(
        JSON.stringify({
          message: "You are not authorized to update this task",
        }),
        { status: 403 }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title || existingTask.title,
        description: description || existingTask.description,
        status: status || existingTask.status,
        priority: priority || existingTask.priority,
        dueDate: dueDate ? new Date(dueDate) : existingTask.dueDate,
      },
    });

    return new Response(
      JSON.stringify({
        message: "Task updated successfully",
        task: updatedTask,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating task:", error);
    return new Response(
      JSON.stringify({ message: "Something went wrong", error: error.message }),
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  const url = new URL(req.url);

  const id = url.searchParams.get("id");
  if (!id || id.trim() === "") {
    return new Response(JSON.stringify({ message: "Task ID is required" }), {
      status: 400,
    });
  }

  const existingTask = await prisma.task.findUnique({
    where: { id },
  });

  if (!existingTask) {
    return new Response(JSON.stringify({ message: "Task not found" }), {
      status: 404,
    });
  }

  try {
    // Delete task by ID
    await prisma.task.delete({
      where: {
        id: existingTask.id,
      },
    });

    return new NextResponse(
      JSON.stringify({ message: "Task deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong" }),
      {
        status: 500,
      }
    );
  }
}
