import React from 'react';
import History from '@/components/history';
import WorkflowList from '@/components/workflow_list';
import NewWorkflow from '@/components/new_workflow';

const Admin = () => {
  return (
    <div className="w-1/2 max-md:w-full flex flex-col gap-12 mx-auto pt-8 px-12 border-x-2 bg-slate-100">
      <NewWorkflow />
      <WorkflowList />
      <History />
    </div>
  );
};

export default Admin;
