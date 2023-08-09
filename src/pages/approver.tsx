import getHandler from '@/handlers/getHandler';
import postHandler from '@/handlers/postHandler';
import { Request } from '@/types';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Acceptor = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selected, setSelected] = useState(false);
  const [comment, setComment] = useState('');
  const [selectedFunc, setSelectedFunc] = useState<() => void>(() => {});
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    getHandler('/approver/get-requests')
      .then((res) => {
        if (res.statusCode == 200) setRequests(res.data || []);
        else toast.error(res.data.message);
      })
      .catch((err) => {
        toast.error('Internal Server Error');
      });
  }, []);

  const handleAccept = async () => {
    const formData = {
      requestId: selectedId,
      comment,
    };

    const res = await postHandler('/approver/approve-request', formData);
    if (res.statusCode == 201) {
      setRequests(
        requests.filter((request) => {
          return request.id != selectedId;
        })
      );
      setSelected(false);
      setComment('');
      toast.success('Request Approved');
    } else {
      toast.error(res.data.message);
      console.log(res);
    }
  };

  const handleReject = async () => {
    const formData = {
      requestId: selectedId,
      comment,
    };

    const res = await postHandler('/approver/reject-request', formData);
    if (res.statusCode == 201) {
      setRequests(
        requests.filter((request) => {
          return request.id != selectedId;
        })
      );
      setSelected(false);
      setComment('');
      toast.success('Request Rejected');
    } else {
      toast.error(res.data.message);
      console.log(res);
    }
  };

  const handleJustify = async () => {
    const formData = {
      requestId: selectedId,
      comment,
    };
    const res = await postHandler('/approver/justify-request', formData);
    if (res.statusCode == 201) {
      setSelected(false);
      setComment('');
      toast.success('Asked for justification');
    } else {
      toast.error(res.data.message);
      console.log(res);
    }
  };

  return (
    <div className="w-1/2 max-md:w-full mx-auto">
      {selected ? (
        <div className="w-1/4 max-md:w-[90vw] bg-white flex flex-col gap-4 py-6 px-4 rounded-xl border-2 fixed top-32 right-1/2 translate-x-1/2 z-50">
          <div className="w-full flex justify-between">
            <div className="text-xl">{selectedTitle}</div>
            <div onClick={() => setSelected(false)} className="cursor-pointer">
              X
            </div>
          </div>

          <input
            className="bg-slate-200 text-black p-3 rounded-lg font-Inconsolata text-xl transition-all duration-200 ease-in-out focus:bg-[#1f1f1f] focus:text-white focus:outline-none"
            type="text"
            placeholder="Add Comment"
            value={comment}
            onChange={(el) => setComment(el.target.value)}
          />

          <div
            className="w-full text-center m-auto bg-slate-50 border-2 text-black border-[#1f1f1f] hover:text-white py-2 rounded-xl font-Inconsolata text-xl hover:bg-[#1f1f1f] transition-all duration-200 ease-in-out"
            onClick={selectedFunc}
          >
            Confirm
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="w-full min-h-screen pt-8 flex flex-col gap-2 border-x-2 bg-slate-50 px-4 ">
        <div className="block text-sm font-medium text-gray-700">List of Pending Requests: </div>
        {requests.map((request) => {
          return (
            <div
              key={request.id}
              className="w-full flex flex-col gap-2 border-2 transition-all duration-200 ease-in-out hover:bg-[#1f1f1f] hover:text-white rounded-xl px-4 py-2"
            >
              <div className="text-xl">Name: {request.name}</div>
              <div className="border-b-2 pb-2">{request.description}</div>
              <div className="w-full flex justify-around">
                <div
                  onClick={() => {
                    setSelectedFunc(() => handleAccept);
                    setSelectedId(request.id);
                    setSelectedTitle('Accept this Request?');
                    setSelected(true);
                  }}
                  className="cursor-pointer p-2 rounded-lg transition-all duration-150 ease-in-out hover:text-black hover:bg-[#65ff87]"
                >
                  Approve
                </div>
                <div
                  onClick={() => {
                    setSelectedFunc(() => handleReject);
                    setSelectedId(request.id);
                    setSelectedTitle('Reject this Request?');
                    setSelected(true);
                  }}
                  className="cursor-pointer p-2 rounded-lg transition-all duration-150 ease-in-out hover:text-black hover:bg-[#ff7676]"
                >
                  Reject
                </div>
                <div
                  onClick={() => {
                    setSelectedFunc(() => handleJustify);
                    setSelectedId(request.id);
                    setSelectedTitle('Ask for Justification?');
                    setSelected(true);
                  }}
                  className="cursor-pointer p-2 rounded-lg transition-all duration-150 ease-in-out hover:text-black hover:bg-[#f2ff92]"
                >
                  Ask for Justification
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Acceptor;
