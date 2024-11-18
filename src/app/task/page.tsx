"use client";

import CreateAndUpdateTaskModal from "@/components/task/CreateAndUpdateTaskModal";
import TaskCard from "@/components/task/TaskCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskI } from "@/types/task";
import axios from "axios";
import { PlusCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ZodUndefinedDef } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

const page = () => {
  const [open, setOpen] = useState(false);

  const [tasks, setTasks] = useState<TaskI[] | null>(null);
  const [editTask, setEditTask] = useState<TaskI | null>(null);
  const [filter, setFilter] = useState<{
    status: string;
    priority: string;
    dueDate: Date | undefined;
  }>({
    status: "",
    priority: "",
    dueDate: undefined,
  });

  const [sort, setSort] = useState("dueDate_desc");

  const handleEditTask = (task: TaskI) => {
    setOpen(true);
    setEditTask(task);
  };

  const handleDeleteTask = (id: string) => {
    axios
      .delete(`/api/task?id=${id}`)
      .then((res) => {
        const data = res.data as { message: string };
        toast.success(data.message);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const query = new URLSearchParams();
    query.append("sort", sort);

    if (filter.dueDate) query.append("dueDate", filter.dueDate.toISOString());
    if (filter.status !== "") query.append("status", filter.status);
    if (filter.priority !== "") query.append("priority", filter.priority);

    axios
      .get(`/api/task?${query.toString()}`)
      .then((res) => {
        const data = res.data as unknown as {
          tasks: TaskI[];
        };

        setTasks(data.tasks);
      })
      .catch((err) => console.log(err));
  }, [sort, filter]);

  return (
    <div className="h-[calc(100%-4rem)] w-full">
      <div className="h-[10%] w-full flex flex-row border-b">
        <div className="w-[90%] h-full flex items-center space-x-4 px-4">
          {/* Filter by Priority */}
          <div className="w-1/4">
            <label
              htmlFor="priority-filter"
              className="block text-sm font-medium"
            >
              Priority
            </label>
            <Select
              onValueChange={(value) =>
                setFilter((prevState) => {
                  return {
                    ...prevState,
                    priority: value,
                  };
                })
              }
              defaultValue={filter.priority}
            >
              <SelectTrigger id="priority-filter" className="mt-1">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="NORMAL">Normal</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter by Status */}
          <div className="w-1/4">
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium"
            >
              Status
            </label>
            <Select
              onValueChange={(value) =>
                setFilter((prevState) => {
                  return {
                    ...prevState,
                    status: value,
                  };
                })
              }
              defaultValue={filter.status}
            >
              <SelectTrigger id="status-filter" className="mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TODO">To do</SelectItem>
                <SelectItem value="INPROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter by Due Date */}
          <div className="w-1/4">
            <label
              htmlFor="due-date-filter"
              className="block text-sm font-medium"
            >
              Due Date
            </label>
            <div className="relative mt-1">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !filter.dueDate && "text-muted-foreground"
                    )}
                  >
                    {filter.dueDate ? (
                      format(filter.dueDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filter.dueDate || new Date()}
                    onSelect={(e) =>
                      setFilter((prevState) => {
                        return {
                          ...prevState,
                          dueDate: e,
                        };
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="h-full w-36 flex justify-center items-center">
            <Button
              onClick={() =>
                setFilter({
                  status: "",
                  priority: "",
                  dueDate: undefined,
                })
              }
            >
              Reset Filter
            </Button>
          </div>

          {/* Sort */}
          <div className="w-1/4">
            <label htmlFor="sort" className="block text-sm font-medium">
              Sort
            </label>
            <Select
              onValueChange={(value) => setSort(value)}
              defaultValue={sort}
            >
              <SelectTrigger id="sort" className="mt-1">
                <SelectValue placeholder="Due Date (Ascending)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate_asc">
                  Due Date (Ascending)
                </SelectItem>
                <SelectItem value="dueDate_desc">
                  Due Date (Descending)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="w-[10%] h-full grid justify-center items-center">
          <button onClick={() => setOpen(true)}>
            <PlusCircleIcon />
          </button>
        </div>
      </div>
      <div className="h-[90%] w-full">
        {tasks && tasks.length > 0 ? (
          <div className="h-full w-full grid grid-cols-5  px-2 py-4">
            {tasks.map((item, index) => (
              <TaskCard
                key={item.id}
                task={item}
                handleTaskEditClick={handleEditTask}
                handleDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        ) : (
          <div className="h-full w-full flex justify-center items-center">
            <span>No Tasks Found</span>
          </div>
        )}
      </div>
      {open && (
        <CreateAndUpdateTaskModal
          isOpen={open}
          setIsOpen={setOpen}
          task={editTask}
        />
      )}
    </div>
  );
};

export default page;
