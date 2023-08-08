import React, { useEffect, useState } from 'react';
import { Approver, Workflow } from '@/types';
import { initialWorkflow } from '@/types/initials';
import configuredAxios from '@/config/axios';
import { toast } from 'react-toastify';

const Admin = () => {
  const [workflow, setWorkflow] = useState<Workflow>(initialWorkflow);
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([]);

  useEffect(() => {
    configuredAxios
      .get('/admin/get-approvers')
      .then((res) => {
        if (res.status == 200) setApprovers(res.data.approvers || []);
        else toast.error(res.data.message);
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
    try {
      const res = await configuredAxios.post('/admin/create-workflow', formData);
      if (res.status == 201) {
        //
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error('Internal Server Error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="flex flex-col gap-6">
        <div className="text-2xl">Add New WorkFlow</div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="id"
              name="id"
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
            <div className="block text-sm font-medium text-gray-700">List of Approvers: </div>
            {approvers.map((approver) => {
              return (
                <div
                  key={approver.id}
                  onClick={() => {
                    if (selectedApprovers.includes(approver.userId)) return;
                    setSelectedApprovers((prev) => [...prev, approver.userId]);
                  }}
                  className={`w-full ${selectedApprovers.includes(approver.userId) ? '' : 'hover:bg-slate-300'} rounded-xl text-center py-2`}
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
    </div>
  );
};

export default Admin;
