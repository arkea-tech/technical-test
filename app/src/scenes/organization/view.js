import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useHistory, useParams } from "react-router-dom";

import Loader from "../../components/loader";
import LoadingButton from "../../components/loadingButton";
import api from "../../services/api";

export default () => {
  const [unit, setUnit] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    (async () => {
      const response = await api.get(`/organization/${id}`);
      setUnit(response.data[0]);
    })();
  }, []);

  if (!unit) return <Loader />;

  return (
    <div>
      <div className="appContainer pt-24">
        <Detail unit={unit} unitId={id} />
      </div>
    </div>
  );
};

const Detail = ({ unit: unit, unitId: unitId }) => {
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

            <div className="flex  mt-2">
              <LoadingButton className="bg-[#0560FD] text-[16px] font-medium text-[#FFFFFF] py-[12px] px-[22px] rounded-[10px]" loading={isSubmitting} onClick={handleSubmit}>
                Update
              </LoadingButton>
              <button className="ml-[10px] bg-[#F43F5E] text-[16px] font-medium text-[#FFFFFF] py-[12px] px-[22px] rounded-[10px]" onClick={deleteData}>
                Delete
              </button>
            </div>
          </React.Fragment>
        );
      }}
    </Formik>
  );
};
