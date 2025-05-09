import React, { useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import LoadingSpinner from "./Loadingspinner";
import "../Register/RegisterForm.scss";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    enroll: "",
    batch: "",
    branch: "",
    college: "",
    enrollmentType: "",
    selectedDay: "", // Add this new field
  });

  const [loading, setLoading] = useState(false);
  const [clg, setClg] = useState("");
  const [image, setImage] = useState(null);
  const [isValidImage, setIsValidImage] = useState(false);
  const formRef = useRef(null);
  const [customCollege, setCustomCollege] = useState("");

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    phone: "",
    enroll: "",
    batch: "",
    branch: "",
    college: "",
    screenshot: "",
    enrollmentType: "",
    selectedDay: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "clg") {
      setClg(value);
      setFormData((prevData) => ({
        ...prevData,
        college: value,
      }));
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCustomCollegeChange = (e) => {
    const value = e.target.value;
    setCustomCollege(value);
    // setFormData((prevData) => ({
    //   ...prevData,
    //   college: value,
    // }));
  };

  const handleImage = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setIsValidImage(false);
      setImage(null);
      return;
    }

    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Invalid file format. Please upload JPEG, JPG, PNG or WEBP files only"
      );
      setIsValidImage(false);
      setImage(null);
      return;
    }

    if (file.size > 1000000) {
      toast.error("File size is too large, please upload a file less than 1MB");
      setIsValidImage(false);
      setImage(null);
      return;
    }

    setIsValidImage(true);
    setFileToBase(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const checkEmailExists = async (email) => {
    try {
      // Placeholder for email existence check
      return false;
    } catch (error) {
      console.error("Error checking email existence: ", error);
      return false;
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!isValidImage) {
      toast.error("Please upload a valid image file first");
      return;
    }

    const errors = {
      name: "",
      email: "",
      phone: "",
      enroll: "",
      batch: "",
      branch: "",
      college: "",
      screenshot: "",
      enrollmentType: "",
      selectedDay: "",
    };

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    console.log("dhdhjjdh", formData.college);

    if (!formData.college.trim()) {
      errors.college = "College name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)
    ) {
      errors.email = "Invalid email format";
    }

    if (!image) {
      errors.screenshot = "Screenshot of payment is required";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      errors.phone = "Invalid phone number.";
    }

    if (
      !formData.enroll.trim() &&
      (formData.college === "JIIT-62" || formData.college === "JIIT-128")
    ) {
      errors.enroll = "Enrollment number is required";
    } else if (
      formData.college === "JIIT-128" &&
      !/^99\d{6,10}$/.test(formData.enroll)
    ) {
      errors.enroll =
        "Enrollment number for JIIT-128 must start with '99' and be 8-12 digits long";
    } else if (formData.college === "JIIT-62" && /^99/.test(formData.enroll)) {
      errors.enroll =
        "Enrollment number for JIIT-62 should not start with '99'";
    }

    if (
      !formData.enrollmentType.trim() &&
      (formData.college === "JIIT-62" || formData.college === "JIIT-128")
    ) {
      errors.enrollmentType = "Enrollment Type is required";
    }

    if (
      !formData.branch.trim() &&
      (formData.college === "JIIT-62" || formData.college === "JIIT-128")
    ) {
      errors.branch = "Branch is required";
    } else if (
      formData.branch.trim() &&
      !/^(cse|computer science|ece|electronics and communication|ece-vlsi|bt|biotech|bba|mba|bcom|mcom|mtech|phd|m\.des)$/i.test(
        formData.branch
      )
    ) {
      errors.branch =
        "Invalid branch. Allowed branches are: CSE, ECE, ECE-VLSI, BT, BBA, MBA, BCOM, MCOM, MTECH, PHD";
    }
    const batchMatch = formData?.batch?.match(/\d+$/);
    const batchNumber = batchMatch ? parseInt(batchMatch[0], 10) : NaN;

    if (
      !formData.batch.trim() &&
      (formData.college === "JIIT-62" || formData.college === "JIIT-128")
    ) {
      errors.batch = "Batch is required";
    } else if (
      formData.college === "JIIT-128" &&
      !/^(f1[0-9]?|f[1-9]|e1[0-9]?|e[1-7])$/i.test(formData.batch)
    ) {
      errors.batch =
        "Batch for JIIT-128 must be in the range F1-F19 or E1-E19 (case-insensitive)";
    } else if (
      formData.college != "other" &&
      !/^[a-zA-Z]/.test(formData.batch)
    ) {
      const normalizedCollege = customCollege
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase();

      const isJIIT = ["JIIT", "JIIT62", "JIIT128", "JIIT2"].includes(
        normalizedCollege
      );

      if (isJIIT) {
        errors.college = "Select JIIT from the provided fields.";
      }
      errors.batch = "Invalid Batch";
    } else if (
      (formData.college != "other" && !/^\D*(\d+)$/.test(formData.batch)) ||
      batchNumber >= 20
    ) {
      errors.batch = "Invalid Batch";
    }

    if (formData.college === "other" && customCollege == "") {
      errors.college = "Please provide college name";
      // toast.error("College not selected.");
      // return;
    } else if (formData.college === "other") {
      // console.log(customCollege, " ", formData.college);
      formData.batch = "other";
      formData.branch = "other";
      formData.enroll = "other";
      formData.enrollmentType = "other";
      formData.college = customCollege;
    }

    if (!formData.selectedDay) {
      errors.selectedDay = "Please select a day option";
    }

    setFormErrors(errors);

    if (!Object.values(errors).some((error) => error !== "")) {
      const emailExists = await checkEmailExists(formData.email);

      if (emailExists) {
        toast.error("User Already Registered");
        return;
      }

      const finalData = {
        ...formData,
        image,
      };
      console.log(finalData);
      setLoading(true);
      console.log(finalData);
      try {
        setLoading(true);
        const response = await axios.post(
          "https://backend.jiitopticachapter.com/api/register-new",
          finalData
        );
        console.log("Registration response:", finalData);
        if (response.status === 201) {
          toast.success("Registration Completed");
          setTimeout(() => {
            window.location.reload();
          }, 1500);
          setFormData({
            name: "",
            email: "",
            phone: "",
            enroll: "",
            batch: "",
            branch: "",
            college: "",
            enrollmentType: "",
            selectedDay: "",
          });
          setClg("");
          setImage(null);
        }
      } catch (error) {
        console.error("Registration error:", error);
        toast.error(
          error.response?.data?.msg || "Something went wrong. Please try again"
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const validateFields = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.phone.trim()) errors.phone = "Phone is required";

    if (!clg) {
      errors.college = "Please select your college";
    } else if (clg === "other" && !customCollege.trim()) {
      errors.college = "Please enter your college name";
    }

    if (!formData.selectedDay) errors.selectedDay = "Please select a day";
    if (!image) errors.screenshot = "Please upload your payment screenshot";

    if (clg === "JIIT-62" || clg === "JIIT-128") {
      if (!formData.enrollmentType)
        errors.enrollmentType = "Select enrollment type";
      if (!formData.enroll) errors.enroll = "Enrollment number is required";
      if (!formData.batch) errors.batch = "Batch is required";
      if (!formData.branch) errors.branch = "Branch is required";
    }

    return errors;
  };

  const getQRCodeSource = (selectedDay) => {
    switch (selectedDay) {
      case "day1":
        return "/qrimage/Day1.jpg";
      case "day2":
        return "/qrimage/Day1.jpg";
      case "both":
        return "/qrimage/Day2.jpg";
      default:
        return "";
    }
  };

  const getDayPrice = (selectedDay) => {
    switch (selectedDay) {
      case "day1":
        return "Rs. 90/-";
      case "day2":
        return "Rs. 90/-";
      case "both":
        return "Rs. 180/-";
      default:
        return "";
    }
  };

  return (
    <>
      <ToastContainer />
      <LoadingSpinner show={loading} />

      <h1 className="register-header">Register Now</h1>

      <div
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <h3>Registrations are Closed !!</h3>
      </div>

      {/* <div className="registration-page">
        <div className="registration-page-section">
          <div className="regis-guideline-section">
            <div className="guideline-container">
              <div className="registration-page-header">
                <div className="registration-page-header-text">
                  <div className="registration-page-header-content">
                    Guidelines For JSCOP 7.0
                  </div>
                  <div className="registration-page-header-underline"></div>
                </div>
              </div>

              <div className="regis-guidelines">
                <div className="regis-sub-heading">General Instructions</div>

                <ol>
                  <li>
                    The registration charges asked during the registration is
                    for the lunch and refreshments which will be provided on the
                    day of the event.
                  </li>
                  <li>
                    There are limited registrations only for the lunch and
                    refreshments, forms may close anytime.
                  </li>
                  <li>
                    Individual event registration are free of cost and can be
                    done from Event section at the home page.
                  </li>
                </ol>

                <div className="regis-sub-heading">
                  Registration Process Details
                </div>

                <ol>
                  <li>
                    Fill the form correctly, make the payment of Rs 90/- only by
                    scanning the QR given below of the account holder named
                    Tashif Ahmed Khan.
                  </li>
                  <li>
                    Fill the details accurately, make the payment and than
                    attach a screenshot of the payment with visible time, date
                    and the name of the sender in it. In case, if these details
                    are not present your registration will not be accepted.
                  </li>
                  <li>
                    After the form is submitted, within 24 hours you will get a
                    confirmation mail of the payment recieved and an a QR
                    attached with it.
                  </li>
                  <li>
                    The QR is the Lunch coupon which will be required at the
                    mess.
                  </li>
                  <li>Timeline and events can be viewed at the home page.</li>
                  <li>
                    In case you have any query or do not receive any
                    confirmation within next 24 hours you can contact us on
                    whatsapp : 8570940287
                    <br />
                    mail : opticastudentchapterjiit@gmail.com
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="regis">
            <div className="registration-page-header">
              <div className="registration-page-header-text">
                <div className="registration-page-header-content">
                  Registration Form
                </div>
                <div className="registration-page-header-underline"></div>
              </div>
            </div>

            <form
              ref={formRef}
              className="registration-form"
              onSubmit={handleFormSubmit}
            >
              <div>
                <label htmlFor="name">
                  Name <span className="required">*</span>:
                </label>
                <input
                  className="reginput"
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  placeholder="Enter your name"
                  onChange={handleInputChange}
                />
                {formErrors.name && <p className="error">{formErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="email">
                  Email <span className="required">*</span>:
                </label>
                <input
                  className="reginput"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {formErrors.email && (
                  <p className="error">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone">
                  Phone <span className="required">*</span>:
                </label>
                <input
                  className="reginput"
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {formErrors.phone && (
                  <p className="error">{formErrors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="college">
                  College <span className="required">*</span>:
                </label>
                <div className="custom-select-container">
                  <select
                    className="custom-select"
                    id="clg"
                    name="clg"
                    value={clg}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>
                      Select College
                    </option>
                    <option value="JIIT-62">JIIT-62</option>
                    <option value="JIIT-128">JIIT-128</option>
                    <option value="other">Other...</option>
                  </select>

                  <div className="select-arrow">▼</div>
                </div>
                {formErrors.college && (
                  <p className="error">{formErrors.college}</p>
                )}
              </div>
              <div>
                {clg === "other" && (
                  <input
                    type="text"
                    placeholder="Enter your college name"
                    value={customCollege}
                    onChange={handleCustomCollegeChange}
                    style={{ marginBottom: "20px" }}
                    className="custom-college-box"
                    name="input_clg"
                  />
                )}
              </div>

              {(formData.college === "JIIT-62" ||
                formData.college === "JIIT-128") && (
                <>
                  <div>
                    <label>
                      Enrollment Type <span className="required">*</span>:
                    </label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          id="dayscholar"
                          name="enrollmentType"
                          value="dayScholar"
                          onChange={handleInputChange}
                        />
                        <span className="radio-custom"></span>
                        Day Scholar
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          id="hosteller"
                          name="enrollmentType"
                          value="hosteller"
                          onChange={handleInputChange}
                        />
                        <span className="radio-custom"></span>
                        Hosteller
                      </label>
                    </div>
                    {formErrors.enrollmentType && (
                      <p className="error">{formErrors.enrollmentType}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="enroll">
                      Enrollment Number <span className="required">*</span>:
                    </label>
                    <input
                      className="reginput"
                      type="text"
                      id="enroll"
                      name="enroll"
                      placeholder="Enter your Enrollment number"
                      value={formData.enroll}
                      onChange={handleInputChange}
                    />
                    {formErrors.enroll && (
                      <p className="error">{formErrors.enroll}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="batch">
                      Batch <span className="required">*</span>:
                    </label>
                    <input
                      className="reginput"
                      type="text"
                      id="batch"
                      name="batch"
                      placeholder="Enter your batch"
                      value={formData.batch}
                      onChange={handleInputChange}
                    />
                    {formErrors.batch && (
                      <p className="error">{formErrors.batch}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="branch">
                      Branch <span className="required">*</span>:
                    </label>
                    <input
                      className="reginput"
                      type="text"
                      id="branch"
                      name="branch"
                      placeholder="Enter your branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                    />
                    {formErrors.branch && (
                      <p className="error">{formErrors.branch}</p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label>
                  Select Day Option <span className="required">*</span>:
                </label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="selectedDay"
                      value="day1"
                      checked={formData.selectedDay === "day1"}
                      onChange={handleInputChange}
                    />
                    <span className="radio-custom"></span>
                    Day One (90/-)
                  </label>

                  <label className="radio-label">
                    <input
                      type="radio"
                      name="selectedDay"
                      value="day2"
                      checked={formData.selectedDay === "day2"}
                      onChange={handleInputChange}
                    />
                    <span className="radio-custom"></span>
                    Day Two [4th May, Sun] (90/-)
                  </label>

                  <label className="radio-label">
                    <input
                      type="radio"
                      name="selectedDay"
                      value="both"
                      checked={formData.selectedDay === "both"}
                      onChange={handleInputChange}
                    />
                    <span className="radio-custom"></span>
                    Both Days (180/-)
                  </label>
                </div>
                {formErrors.selectedDay && (
                  <p className="error">{formErrors.selectedDay}</p>
                )}
              </div>

              {formData.selectedDay && (
                <div className="qr-section">
                  <h3>Payment QR Code ({getDayPrice(formData.selectedDay)})</h3>
                  <div className="qr-container">
                    <img
                      src={getQRCodeSource(formData.selectedDay)}
                      className="qr-image"
                      alt={`QR code for ${formData.selectedDay}`}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="screenshot">
                  Upload Screenshot of Payment{" "}
                  <span className="required">*</span>:
                </label>
                <div className="custom-file-input">
                  <input
                    type="file"
                    id="screenshot"
                    name="screenshot"
                    onChange={handleImage}
                  />
                  <div className="custom-file-button">
                    <span className="file-icon">📎</span>
                    <span>{image ? "Image Uploaded" : "Choose File..."}</span>
                  </div>
                </div>
                {formErrors.screenshot && (
                  <p className="error">{formErrors.screenshot}</p>
                )}
              </div>

              <div className="heyreg" onClick={handleFormSubmit}>
                <div
                  className="button-wrapper  button__container"
                  style={{
                    filter: "grayscale(100%)",
                    WebkitFilter: "grayscale(100%)",
                  }}
                >
                  <a
                    className="background-button"
                    href="#"
                    title="Register"
                    onClick={handleFormSubmit}
                  ></a>
                </div>
              </div>
            </form>
          </div>
        </div>
        {loading && (
          <div className="fullscreen-loader">
            <div className="spinner"></div>
          </div>
        )}
      </div> */}
    </>
  );
}
