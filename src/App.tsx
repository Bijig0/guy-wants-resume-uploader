import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FiFile } from "react-icons/fi";
import "./App.css";
import { FileUpload } from "./file-upload";

type FormValues = {
  file_: FileList;
  role: string;
};

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const toast = useToast();

  const { mutate } = useMutation({
    mutationFn: async (data: FormValues) => {
      // Make post request here
      console.log("data: ", data);
    },
    onSuccess: () => {
      toast({
        title: "Resume uploaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: () => {
      console.log("error");
    },
  });

  const onSubmit = handleSubmit((data) => mutate(data));

  const validateFiles = (value: FileList) => {
    if (value.length < 1) {
      return "Files is required";
    }
    for (const file of Array.from(value)) {
      const fsMb = file.size / (1024 * 1024);
      const MAX_FILE_SIZE = 10;
      if (fsMb > MAX_FILE_SIZE) {
        return "Max file size 10mb";
      }
    }
    return true;
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <FormControl isInvalid={!!errors.file_} isRequired>
          <FormLabel>{"File input"}</FormLabel>

          <FileUpload
            accept={"image/*"}
            multiple
            register={register("file_", { validate: validateFiles })}
          >
            <Button leftIcon={<Icon as={FiFile} />}>Upload</Button>
          </FileUpload>

          <FormErrorMessage>
            {errors.file_ && errors?.file_.message}
          </FormErrorMessage>
        </FormControl>

        <Select
          {...register("role", { required: true })}
          placeholder="Select option"
        >
          <option value="dataEngineer">Data Engineer</option>
          <option value="pythonDeveloper">Python Developer</option>
          <option value="MLEngineer">ML Engineer</option>
          <option value="AIEngineer">AI Engineer</option>
        </Select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
