import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Modal from "../ui/Modal";

import { createTaskSchema } from "@/schema/task";
import { CreateTaskI, TaskI } from "@/types/task";
import { CalendarIcon, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import axios from "axios";
import { toast } from "react-toastify";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  task: TaskI | null;
}

const Title = ({
  setOpen,
  task,
}: {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  task: TaskI | null;
}) => {
  return (
    <div className="h-[10%] w-full flex items-center justify-between">
      <h1 className="text-lg ">{task ? "Update" : "Create"} Task</h1>
      <button onClick={() => setOpen(false)}>
        <X />
      </button>
    </div>
  );
};

const Body = ({
  setIsOpen,
  task,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  task: TaskI | null;
}) => {
  const taskCreationForm = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: task ? task.status : "",
      priority: task ? task.priority : "",
    },
  });

  useEffect(() => {
    if (task) {
      taskCreationForm.setValue("title", task.title);
      taskCreationForm.setValue("description", task.description);
      taskCreationForm.setValue("status", task.status);
      taskCreationForm.setValue("priority", task.priority);
      taskCreationForm.setValue("dueDate", new Date(task.dueDate));
    }
  }, [task, taskCreationForm]);

  const handleSubmit = (data: CreateTaskI) => {
    if (task) {
      axios
        .put("/api/task", {
          id: task.id,
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          dueDate: data.dueDate,
        })
        .then((res) => {
          const data = res.data as { message: string };
          toast.success(data.message);
          setIsOpen(false);
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .post("/api/task", {
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          dueDate: data.dueDate,
        })
        .then((res) => {
          const data = res.data as { message: string };
          toast.success(data.message);
          setIsOpen(false);
        })
        .catch((err) => console.log(err));
    }
  };

  const onSubmit: SubmitHandler<CreateTaskI> = (data) => handleSubmit(data);

  return (
    <div className="h-[90%] w-full">
      <Form {...taskCreationForm}>
        <form
          onSubmit={taskCreationForm.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={taskCreationForm.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={taskCreationForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Task Description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={taskCreationForm.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="TODO">To do</SelectItem>
                      <SelectItem value="INPROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={taskCreationForm.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="NORMAL">Normal</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={taskCreationForm.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="h-full w-full flex justify-end">
            <Button type="submit">{task ? "Update" : "Submit"}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const CreateAndUpdateTaskModal = ({ isOpen, setIsOpen, task }: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      baseClassName="h-auto w-[90%] md:h-[70%] md:w-[35%] "
      setIsOpen={setIsOpen}
      title={<Title setOpen={setIsOpen} task={task} />}
      body={<Body setIsOpen={setIsOpen} task={task} />}
    />
  );
};

export default CreateAndUpdateTaskModal;
