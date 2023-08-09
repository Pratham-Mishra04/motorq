import getHandler from '@/handlers/getHandler';
import postHandler from '@/handlers/postHandler';
import { Request, Workflow } from '@/types';
import { initialRequest } from '@/types/initials';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const NewRequest = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [request, setRequest] = useState<Request>(initialRequest);

  useEffect(() => {
    getHandler('/requester/get-workflows')
      .then((res) => {
        if (res.statusCode == 200) setWorkflows(res.data || []);
        else toast.error(res.data.message);
      })
      .catch((err) => {
        toast.error('Internal Server Error');
      });
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setRequest((prevRequest) => ({
      ...prevRequest,
      [name]: value,
    }));
  };

  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setRequest((prevRequest) => ({
      ...prevRequest,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = {
      name: request.name,
      description: request.description,
      workflowId: request.workflowId,
    };

    const res = await postHandler('/requester/create-request ', formData);
    if (res.statusCode == 201) {
      // setPendingRequests((prev) => [...prev, request]);
      setRequest(initialRequest);
      toast.success('Request Added.');
    } else {
      toast.error(res.data.message);
    }
  };
  return (
    <div className="flex flex-col gap-6">
      <div className="text-2xl">Add New Request</div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={request.name}
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
            value={request.description}
            onChange={handleTextAreaChange}
            rows={3}
            className="w-full bg-slate-200 text-black p-3 rounded-lg font-Inconsolata text-xl transition-all duration-200 ease-in-out focus:bg-[#1f1f1f] focus:text-white focus:outline-none"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="block text-sm font-medium text-gray-700">List of Workflows: </div>
          {workflows.map((workflow) => {
            return (
              <div
                key={workflow.id}
                onClick={() =>
                  setRequest((prevRequest) => ({
                    ...prevRequest,
                    workflowId: workflow.id,
                  }))
                }
                className={`w-full border-2 cursor-pointer transition-all duration-200 ease-in-out ${
                  request.workflowId == workflow.id ? 'bg-[#1f1f1f] text-white' : 'hover:bg-[#1f1f1f] hover:text-white'
                } flex flex-col gap-1 rounded-xl text-center py-2`}
              >
                <div className="text-2xl border-b-[1px] pb-2">{workflow.name}</div>
                <div>{workflow.description}</div>
              </div>
            );
          })}
        </div>
        <button
          type="submit"
          className="w-full m-auto bg-slate-50 border-2 text-black border-[#1f1f1f] hover:text-white py-2 rounded-xl font-Inconsolata text-xl hover:bg-[#1f1f1f] transition-all duration-200 ease-in-out"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewRequest;
