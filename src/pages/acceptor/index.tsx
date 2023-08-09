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
    }
  };

  return (
    <div className="w-1/3 m-auto">
      {selected ? (
        <div className="bg-white border-2">
          <div className="w-full flex justify-between">
            <div>{selectedTitle}</div>
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

          <div onClick={selectedFunc}>Confirm?</div>
        </div>
      ) : (
        <></>
      )}
      <div className="flex flex-col gap-2">
        <div className="block text-sm font-medium text-gray-700">List of Requests: </div>
        {requests.map((request) => {
          return (
            <div key={request.id} className="w-full flex flex-col gap-1 hover:bg-slate-300 rounded-xl text-center py-2">
              <div>{request.name}</div>
              <div>{request.description}</div>
              <div className="w-full flex justify-around">
                <div
                  onClick={() => {
                    setSelectedFunc(() => handleAccept);
                    setSelectedId(request.id);
                    setSelectedTitle('Accept this Request?');
                    setSelected(true);
                  }}
                  className="cursor-pointer"
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
                  className="cursor-pointer"
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
                  className="cursor-pointer"
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
