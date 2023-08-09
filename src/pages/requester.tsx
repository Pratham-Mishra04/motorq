import NewRequest from '@/components/requester/new_request';
import RequestComponent from '@/components/requester/request';
import getHandler from '@/handlers/getHandler';
import postHandler from '@/handlers/postHandler';
import { Request } from '@/types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Requester = () => {
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<Request[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<Request[]>([]);
  const [justifiedRequests, setJustifiedRequests] = useState<Request[]>([]);

  const [addJustification, setAddJustification] = useState(false);
  const [justification, setJustification] = useState('');
  const [justificationRequestID, setJustificationRequestID] = useState('');

  useEffect(() => {
    getHandler('/requester/get-approved')
      .then((res) => {
        if (res.statusCode == 200) setAcceptedRequests(res.data || []);
        else toast.error(res.data.message);
      })
      .catch((err) => {
        toast.error('Internal Server Error');
      });

    getHandler('/requester/get-justified')
      .then((res) => {
        if (res.statusCode == 200) setJustifiedRequests(res.data || []);
        else toast.error(res.data.message);
      })
      .catch((err) => {
        toast.error('Internal Server Error');
      });

    getHandler('/requester/get-pending')
      .then((res) => {
        if (res.statusCode == 200) setPendingRequests(res.data || []);
        else toast.error(res.data.message);
      })
      .catch((err) => {
        toast.error('Internal Server Error');
      });

    getHandler('/requester/get-rejected')
      .then((res) => {
        if (res.statusCode == 200) setRejectedRequests(res.data || []);
        else toast.error(res.data.message);
      })
      .catch((err) => {
        toast.error('Internal Server Error');
      });
  }, []);

  const handleJustification = async () => {
    const formData = {
      requestId: justificationRequestID,
      description: justification,
    };
    const res = await postHandler('/requester/add-justification', formData);
    if (res.statusCode == 201) {
      setAddJustification(false);
      toast.success('Justification Added');
    } else {
      toast.error(res.data.message);
    }
  };

  return (
    <div className="w-1/2 pb-8 max-md:w-full flex flex-col gap-12 mx-auto pt-8 px-12 border-x-2 bg-slate-50">
      {addJustification ? (
        <div className="w-1/4 max-md:w-[90vw] bg-white flex flex-col gap-4 py-6 px-4 rounded-xl border-2 fixed top-32 right-1/2 translate-x-1/2 z-50">
          <div className="w-full flex justify-between">
            <div className="text-xl">Add Justification</div>
            <div onClick={() => setAddJustification(false)} className="cursor-pointer">
              X
            </div>
          </div>

          <input
            className="bg-slate-200 text-black p-3 rounded-lg font-Inconsolata text-xl transition-all duration-200 ease-in-out focus:bg-[#1f1f1f] focus:text-white focus:outline-none"
            type="text"
            placeholder="Add Justification"
            value={justification}
            onChange={(el) => setJustification(el.target.value)}
          />

          <div
            className="w-full text-center m-auto bg-slate-50 border-2 text-black border-[#1f1f1f] hover:text-white py-2 rounded-xl font-Inconsolata text-xl hover:bg-[#1f1f1f] transition-all duration-200 ease-in-out"
            onClick={handleJustification}
          >
            Confirm
          </div>
        </div>
      ) : (
        <></>
      )}
      <NewRequest />
      <div className="flex flex-col gap-2">
        <div className="block text-sm font-medium text-gray-700">List of Approved Requests: </div>
        {acceptedRequests.map((request) => {
          return <RequestComponent key={request.id} request={request} />;
        })}
      </div>

      <div className="flex flex-col gap-2">
        <div className="block text-sm font-medium text-gray-700">List of Rejected Requests: </div>
        {rejectedRequests.map((request) => {
          return <RequestComponent key={request.id} request={request} />;
        })}
      </div>

      <div className="flex flex-col gap-2">
        <div className="block text-sm font-medium text-gray-700">List of Pending Requests: </div>
        {pendingRequests.map((request) => {
          return <RequestComponent key={request.id} request={request} />;
        })}
      </div>

      <div className="flex flex-col gap-2">
        <div className="block text-sm font-medium text-gray-700">List of Justified Requests: </div>

        {justifiedRequests.map((request) => {
          return (
            <div
              key={request.id}
              onClick={() => {
                setJustificationRequestID(request.id);
                setAddJustification(true);
              }}
              className="w-full cursor-pointer border-2 flex flex-col gap-1 hover:bg-slate-300 rounded-xl text-center py-2"
            >
              <div className="text-xl border-b-[1px] pb-2">Name: {request.name}</div>
              <div>Description: {request.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requester;
