import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TaskI } from "@/types/task";
import { Edit3, Trash } from "lucide-react"; // Importing icons
import { format } from "date-fns";

interface Props {
  task: TaskI;
  handleTaskEditClick: (task: TaskI) => void;
  handleDeleteTask: (id: string) => void;
}

const TaskCard = ({ task, handleTaskEditClick, handleDeleteTask }: Props) => {
  return (
    <Card className="w-64 h-64 border border-gray-200 shadow-md rounded-lg hover:shadow-lg transition-shadow">
      <CardHeader className="bg-blue-50 p-4 rounded-t-lg">
        <CardTitle className="text-lg font-semibold text-gray-800 truncate">
          {task.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 truncate">
          {task.description || <span className="invisible">Placeholder</span>}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 bg-white">
        <div className="h-full w-full flex flex-col space-y-2">
          <span className="text-sm font-medium text-gray-700">
            Status:{" "}
            <span className="font-normal text-gray-500">{task.status}</span>
          </span>
          <span className="text-sm font-medium text-gray-700">
            Due:{" "}
            <span className="font-normal text-gray-500">
              {format(task.dueDate.toLocaleString(), "PPP")}
            </span>
          </span>
          <span className="text-sm font-medium text-gray-700">
            Priority:{" "}
            <span
              className={`font-semibold ${
                task.priority === "High"
                  ? "text-red-500"
                  : task.priority === "Medium"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            >
              {task.priority}
            </span>
          </span>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 rounded-b-lg flex justify-end space-x-4">
        <button
          className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          title="Edit Task"
          onClick={() => handleTaskEditClick(task)}
        >
          <Edit3 className="w-5 h-5" />
          <span>Edit</span>
        </button>
        <button
          className="flex items-center space-x-1 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
          title="Delete Task"
          onClick={() => handleDeleteTask(task.id)}
        >
          <Trash className="w-5 h-5" />
          <span>Delete</span>
        </button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
