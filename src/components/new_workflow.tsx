import getHandler from '@/handlers/getHandler';
import postHandler from '@/handlers/postHandler';
import { Workflow, Approver } from '@/types';
import { initialWorkflow } from '@/types/initials';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const NewWorkflow = () => {
  const [workflow, setWorkflow] = useState<Workflow>(initialWorkflow);
  const [approvers, setApprovers] = useState<Approver[]>([]);

  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([]);

  useEffect(() => {
    getHandler('/admin/get-approvers')
      .then((res) => {
        if (res.statusCode == 200) {
          setApprovers(res.data || []);
        } else toast.error(res.data.message);
      })
      .catch((err) => {
        toast.error('Internal Server Error');
      });
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setWorkflow((prevWorkflow) => ({
      ...prevWorkflow,
      [name]: value,
    }));
  };

  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setWorkflow((prevWorkflow) => ({
      ...prevWorkflow,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = {
      name: workflow.name,
      description: workflow.description,
      type: workflow.type,
      approvers: selectedApprovers,
    };

    const res = await postHandler('/admin/create-workflow', formData);
    if (res.statusCode == 201) {
      toast.success('Workflow Added.');
      //   setWorkflows((prev) => [...prev, workflow]);
      setWorkflow(initialWorkflow);
    } else {
      toast.error(res.data.message);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="text-2xl cursor-pointer">Add New WorkFlow</div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={workflow.name}
            onChange={handleInputChange}
            className="w-full bg-slate-200 text-black p-3 rounded-lg font-Inconsolata text-xl transition-all duration-200 ease-in-out focus:bg-[#1f1f1f] focus:text-white focus:outline-none"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={workflow.description}
            onChange={handleTextAreaChange}
            rows={3}
            className="w-full bg-slate-200 text-black p-3 rounded-lg font-Inconsolata text-xl transition-all duration-200 ease-in-out focus:bg-[#1f1f1f] focus:text-white focus:outline-none"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="block text-sm font-medium text-gray-700">Select Approvers: </div>
          {approvers.map((approver) => {
            return (
              <div
                key={approver.id}
                onClick={() => {
                  if (selectedApprovers.includes(approver.id)) {
                    setSelectedApprovers(selectedApprovers.filter((selectedApprover) => selectedApprover != approver.id));
                    return;
                  }
                  setSelectedApprovers((prev) => [...prev, approver.id]);
                }}
                className={`w-full transition-all duration-200 ease-in-out ${
                  selectedApprovers.includes(approver.id) ? 'bg-[#1f1f1f] text-white' : 'hover:bg-[#1f1f1f] hover:text-white'
                } text-xl cursor-pointer rounded-xl text-center py-2`}
              >
                {approver.User.name}
              </div>
            );
          })}
        </div>
        <button
          type="submit"
          className="w-full m-auto bg-slate-100 border-2 text-black border-[#1f1f1f] hover:text-white py-2 rounded-xl font-Inconsolata text-xl hover:bg-[#1f1f1f] transition-all duration-200 ease-in-out"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewWorkflow;
