"use server";
export const handleForm = async (prevState: any, formData: FormData) => {
  console.log("Logged In!");
  console.log("prevState : ", prevState);
  return {
    errors: ["wrong password,", "password too short"],
  };
};
