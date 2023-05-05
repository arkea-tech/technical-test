import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useHistory, useParams } from "react-router-dom";

import Loader from "../../components/loader";
import LoadingButton from "../../components/loadingButton";
import api from "../../services/api";

export default () => {
  const [unit, setUnit] = useState(null);
  const [associatedUsers, setAssociatedUsers] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    (async () => {
      const response = await api.get(`/organization/${id}`);
      const userData = await api.get("/user");

      setUnit(response.data[0]);
      setAssociatedUsers(userData.data.filter(user => user.unitId === id));
    })();
  }, []);

  if (!unit) return <Loader />;

  return (
    <div>
      <div className="appContainer pt-24">
        <Detail unit={unit} unitId={id} associatedUsers={associatedUsers} />
      </div>
    </div>
  );
};

const Detail = ({ unit, unitId, associatedUsers }) => {
  const history = useHistory();

  async function deleteData() {
    const confirm = window.confirm("Are you sure ?");
    if (!confirm) return;
    await api.remove(`/organization/${unitId}`);
    toast.success("successfully removed!");
    history.push(`/organization`);
  }

  async function handleSubmit(values) {
    try {
      await api.put(`/organization/${unitId}`, values);
      toast.success("Updated!");
      history.push(`/organization`);
    } catch (e) {
      console.log(e);
      toast.error("Some Error!");
    }
  }

  return (
    <Formik
      initialValues={ unit }
      onSubmit={handleSubmit}>
      {({ values, handleChange, handleSubmit, isSubmitting }) => {
        return (
          <React.Fragment>
            <div>
              <div className="flex justify-between flex-wrap mt-4">
                <div className="w-full md:w-[260px] mt-[10px] md:mt-0 ">
                  <div className="text-[14px] text-[#212325] font-medium	">Name</div>
                  <input
                    className="projectsInput text-[14px] font-normal text-[#212325] bg-[#F9FBFD] rounded-[10px]"
                    name="name"
                    value={values.name || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex mt-2">
                <LoadingButton className="bg-[#0560FD] text-[16px] font-medium text-[#FFFFFF] py-[12px] px-[22px] rounded-[10px]" loading={isSubmitting} onClick={handleSubmit}>
                  Update
                </LoadingButton>
                <button className="ml-[10px] bg-[#F43F5E] text-[16px] font-medium text-[#FFFFFF] py-[12px] px-[22px] rounded-[10px]" onClick={deleteData}>
                  Delete
                </button>
              </div>
            </div>

            <div className="pl-18 pt-20 pb-4 w-[98%]">
              <AssociatedUsers associatedUsers={associatedUsers} />
            </div>

          </React.Fragment>
        );
      }}
    </Formik>
  );
};

const AssociatedUsers = ({ associatedUsers }) => {
    return (
      <div className="pl-18 pt-18 pb-4 w-[98%]">
        <div className="bg-[#FFFFFF] border border-[#E5EAEF] py-3 rounded-[16px]">
          <div className="flex justify-between px-3 pb-2  border-b border-[#E5EAEF]">
            <div>
              <span className="text-[18px] text-[#212325] font-semibold">Associated User</span>
            </div>
          </div>
          <div className="flex flex-wrap p-2 gap-5"></div>
          <div className="w-full overflow-hidden">
            <div className="mt-2 rounded-[10px] bg-[#fff]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody>
                    {associatedUsers &&
                      associatedUsers.map((associatedUser, id) => {
                          return (
                            <React.Fragment key={`${id}`}>
                              <tr className="border-t border-b border-r border-[#E5EAEF]" key={`1-${associatedUser._id}`}>
                                <th className="w-[100px] border-t border-b border-r text-[14px] font-weight-normal text-[#212325] text-left">
                                  <div className="flex flex-1 items-center justify-between gap-2 px-2">
                                    <div className="flex flex-1 items-center justify-start gap-2">
                                      <img src={associatedUser.avatar} className="relative z-30 inline object-cover w-[30px] h-[30px] border border-white rounded-full" />
                                      <div>{associatedUser.name}</div>
                                    </div>
                                  </div>
                                </th>
                              </tr>
                            </React.Fragment>
                          );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
