import getHandler from '@/handlers/getHandler';
import postHandler from '@/handlers/postHandler';
import { Workflow, Request } from '@/types';
import { initialRequest } from '@/types/initials';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Requester = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [request, setRequest] = useState<Request>(initialRequest);

  const [userRequests, setUserRequests] = useState<Request[]>([]);

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

  // useEffect(() => {
  //   configuredAxios
  //     .get('/requester/get-requests')
  //     .then((res) => {
  //       if (res.status == 200) setUserRequests(res.data.requests || []);
  //       else toast.error(res.data.message);
  //     })
  //     .catch((err) => {
  //       toast.error('Internal Server Error');
  //     });
  // }, []);

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
      toast.success('Request Added.');
    } else {
      toast.error(res.data.message);
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
                  className={`w-full cursor-pointer ${
                    request.workflowId == workflow.id ? 'bg-slate-300' : ''
                  } flex flex-col gap-1 hover:bg-slate-300 rounded-xl text-center py-2`}
                >
                  <div className="text-xl">{workflow.name}</div>
                  <div>{workflow.description}</div>
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
        <div className="flex flex-col gap-2">
          <div className="block text-sm font-medium text-gray-700">List of Requests: </div>
          {userRequests.map((request) => {
            return (
              <div key={request.id} className="w-full flex flex-col gap-1 hover:bg-slate-300 rounded-xl text-center py-2">
                <div>{request.name}</div>
                <div>{request.description}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Requester;
