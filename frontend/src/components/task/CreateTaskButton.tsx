import { useState } from "react";
import CreateTaskModal from "./CreateTaskModal";
import { Task } from "../../context/types";

const CreateTaskButton = ({
  columnId,
  onTaskCreated,
}: {
  columnId: number;
  onTaskCreated: (task: Task) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="bg-gray-100 text-gray-600 font-semibold w-full text-sm px-4 py-2 rounded shadow-sm hover:bg-gray-200 hover:cursor-pointer transition"
        type="button"
        onClick={() => setOpen(true)}
      >
        + Create
      </button>
      <CreateTaskModal
        isOpen={open}
        onClose={() => setOpen(false)}
        columnId={columnId}
        onTaskCreated={(task) => {
          onTaskCreated(task);
          setOpen(false);
        }}
      />
    </>
  );
};

export default CreateTaskButton;
