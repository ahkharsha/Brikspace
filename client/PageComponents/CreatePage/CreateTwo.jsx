import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

//INTERNAL IMPORT
import { Loader, GlobalLoder } from "../Components";
import { CreateThree } from ".";
import { useStateContext } from "../../context";
import { checkIfImage } from "../../utils";

const categories = [
  "Housing",
  "Rental",
  "Farmhouse",
  "Office",
  "Commercial",
  "Country",
];

const states = ["Tamil Nadu", "Telangana", "Maharashtra", "Karnataka"];

const CreateTwo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [file, setFile] = useState(null);
  const [diplayImg, setDiplayImg] = useState(null);
  const [fileName, setFileName] = useState("Upload Image");

  const {
    currentAccount,
    createPropertyFunction,
    PINATA_API_KEY,
    PINATA_SECRET_KEY,
    loader,
    setLoader,
    notifySuccess,
    notifyError,
  } = useStateContext();

  const [form, setForm] = useState({
    propertyTitle: "",
    description: "",
    category: "",
    price: "",
    images: "",
    propertyAddress: "",
    propertyState: "", // New field for state
  });

  const handleFormFieldChange = (fileName, e) => {
    setForm({ ...form, [fileName]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const {
      propertyTitle,
      description,
      category,
      price,
      images,
      propertyAddress,
      propertyState, // Include state in the form submission
    } = form;

    console.log(
      propertyTitle,
      description,
      category,
      price,
      images,
      propertyAddress,
      propertyState
    );

    if (images || propertyTitle || price || category || description) {
      await createPropertyFunction({
        ...form,
        price: ethers.utils.parseUnits(form.price, 18),
      });
      setIsLoading(false);
    } else {
      console.log("Provide details");
    }
  };

  const uploadToPinata = async () => {
    setLoader(true);
    setFileName("Image Uploading...");
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

        setForm({ ...form, images: ImgHash });
        notifySuccess("Successfully uploaded");
        setFileName("Image Uploaded");
        setLoader(false);
        return ImgHash;
      } catch (error) {
        setLoader(false);
        notifyError("Unable to upload image to Pinata, Check API Key");
      }
    }
  };

  const retrieveFile = (event) => {
    const data = event.target.files[0];

    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
      setFile(event.target.files[0]);

      if (event.target.files && event.target.files[0]) {
        setDiplayImg(URL.createObjectURL(event.target.files[0]));
      }
    };

    event.preventDefault();
  };

  return (
    <>
      <div class="creat-collection-area pt--80">
        <div class="container">
          <div class="row g-5 ">
            <div class="col-lg-3 offset-1 ml_md--0 ml_sm--0">
              {/* Image upload sections */}
            </div>

            <div class="col-lg-7">
              <div class="create-collection-form-wrapper">
                <div class="row">
                  <div class="col-lg-6">
                    <div class="collection-single-wized">
                      <label for="name" class="title required">
                        Property Title
                      </label>
                      <div class="create-collection-input">
                        <input
                          id="name"
                          class="name"
                          type="text"
                          required
                          placeholder="propertyTitle"
                          onChange={(e) =>
                            handleFormFieldChange("propertyTitle", e)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="collection-single-wized">
                      <label class="title">Category</label>
                      <div class="create-collection-input">
                        <div class="nice-select mb--30" tabindex="0">
                          <span class="current">Add Category</span>
                          <ul class="list">
                            {categories.map((el, i) => (
                              <li
                                key={i + 1}
                                onClick={() =>
                                  setForm({
                                    ...form,
                                    category: el,
                                  })
                                }
                                class="option"
                              >
                                {el}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="collection-single-wized">
                      <label for="price" class="title">
                        Price
                      </label>
                      <div class="create-collection-input">
                        <input
                          id="price"
                          type="number"
                          placeholder="price"
                          onChange={(e) => handleFormFieldChange("price", e)}
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="collection-single-wized">
                      <label for="wallet" class="title">
                        Property State
                      </label>
                      <div class="create-collection-input">
                        <div class="nice-select mb--30" tabindex="0">
                          <span class="current">Select State</span>
                          <ul class="list">
                            {states.map((state, i) => (
                              <li
                                key={i + 1}
                                onClick={() =>
                                  setForm({
                                    ...form,
                                    propertyState: state,
                                  })
                                }
                                class="option"
                              >
                                {state}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="collection-single-wized">
                      <label for="description" class="title">
                        Property Address
                      </label>
                      <div class="create-collection-input">
                        <textarea
                          id="description"
                          class="text-area"
                          placeholder="description"
                          onChange={(e) =>
                            handleFormFieldChange("description", e)
                          }
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  {/* Submit Button */}
                  <div class="col-lg-12">
                    <div class="button-wrapper">
                      <a
                        onClick={() => handleSubmit()}
                        class="btn btn-primary-alta btn-large"
                      >
                        {isLoading ? <Loader /> : "Create"}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateThree data={form} />
      {loader && <GlobalLoder />}
    </>
  );
};

export default CreateTwo;
