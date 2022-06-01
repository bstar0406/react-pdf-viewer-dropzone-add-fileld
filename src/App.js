import React, { useMemo } from 'react';
import './assets/scss/App.scss';
import Logo from './assets/iamges/logo.png';
import Help from './assets/iamges/help.png';
import Upload from './assets/iamges/upload.png';
import Close from './assets/iamges/close.png';
import Tick from './assets/iamges/tick.png';
import True from './assets/iamges/true.png';
import False from './assets/iamges/false.png';
import { useDropzone } from 'react-dropzone';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import Select from 'react-select'
// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import PDF from './assets/pdf/123.pdf';
import AddFields from './assets/json/addfields.json';
import GetFields from './assets/json/getfields.json';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#6ACDB4',
  borderStyle: 'dashed',
  backgroundColor: '#F5F6FB',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  height: '94px',
  padding: '30px'
};

const focusedStyle = {
  borderColor: '#6ACDB4'
};

const acceptStyle = {
  borderColor: '#6ACDB4'
};

const rejectStyle = {
  borderColor: '#6ACDB4'
};

function App() {
  const [fields, setFields] = React.useState([]);
  const [details, setDetails] = React.useState([]);
  const [inputs, setInputs] = React.useState([]);
  const [options, setOptions] = React.useState([]);

  React.useEffect(() => {
    setFields(AddFields.AddFields);
    setDetails(GetFields.GetFields);
    let temp = [];
    GetFields.GetFields.map(item => {
      temp.push(item.Field.FieldName, "")
    })
    setInputs(temp);
  }, [])


  React.useEffect(() => {
    let tempOptions = [];
    fields.map((field) => {
      tempOptions.push({ value: field.Field.FieldName, label: <div className='d-flex justify-content-between'>{field.Field.DisplayName} {field.Field.Required === 'true' && <span><img src={Tick} alt='tick' /></span>}</div> })
      return field;
    }
    )
    console.log(tempOptions)
    setOptions(tempOptions)
  }, [fields])

  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({ accept: { 'pdf': ['.pdf'] } });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  const removeField = (field) => {
    let temp = fields;
    temp = fields.map((item) => {
      if (item.Field.FieldName === field.FieldName) {
        item.Field.Required = !item.Field.Required;
      }
      return item;
    })
    setFields(temp)
  }

  const fetch = () => {
    let temp = [];
    GetFields.GetFields.map(item => {
      temp.push(item.Field.FieldName, "")
      return item;
    })
    setInputs(temp)
  }
  const getValue = (value) => {
    let temp = details.filter(item => value === item.Field.FieldName)
    return temp[0]
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInputs({
      ...inputs,
      [id]: value,
    });
  };

  const changeOption = (e) => {
    let temp = fields;
    temp = fields.map((item) => {
      console.log(item.Field.FieldName, e.value)

      if (item.Field.FieldName === e.value) {
        if(item.Field.Required === 'true') item.Field.Required ='false';
        else item.Field.Required = 'true'
      }
      return item;
    })
    setFields(temp)
  }
  return (
    <div className="App">
      <div className="d-flex justify-content-between align-content-center">
        <div>
          <img src={Logo} alt='logo' />
        </div>
        <div className="d-flex align-content-center">
          <div className="d-flex align-content-center">
            <img src={Help} alt='help' className='align-self-center help-image' />
            <div className='align-self-center help-text'>Need Help?</div>
          </div>
          <button className='btn btn-danger log-btn align-self-center'>Log in</button>
        </div>
      </div>
      <div className="body-section">
        <div className='d-flex justify-content-between'>
          <div className="flex-grow-1 me-4">
            <div {...getRootProps({ style })}>
              <input {...getInputProps()} />
              <div className='d-flex'>
                <div className='align-self-start'>
                  <img src={Upload} alt='upload' className='me-2 upload-img' />
                </div>
                <span className='align-self-end'>Drag file to upload, or </span>
                <span className='browse align-self-end me-2'>Browse</span>
                <span className='tiny-text align-self-end'>Supports .pdf (less than 2MB)</span>
              </div>
            </div>
          </div>
          <button className='btn fetch-btn align-self-center' onClick={() => fetch()}>Fetch</button>
        </div>
        <div className='fetch-field d-flex justify-content-between '>
          <div className='field-text'>
            <span>Fetch Fields</span>
          </div>
          <div className='justify-content-start pt-3 ps-3 d-flex flex-wrap'>
            {fields.map((field, index) =>
              field.Field.Required === "true" && <div className='field-style d-flex' key={index}>
                <span>{field.Field.DisplayName}</span>
                <span className='align-self-center ms-2 close' onClick={() => removeField(field.Field)}><img src={Close} alt='close' /></span>
              </div>
            )}
          </div>
          <div className='justify-content-center pe-3'>
            <Select options={options} className='select-field' onChange={(e) => changeOption(e)} isSearchable={false} placeholder="Add Field" controlShouldRenderValue={false}/>
          </div>
        </div>
        <div className='d-flex setting'>
          <div className='fields'>
            <div className='field-list align-self-start'>
              {fields.map((field, index) => (
                field.Field.Required === "true" && (
                  <div className='row d-flex mb-2' key={index}>
                    <div className='col-4 align-self-center'>
                      <span className=''>{field.Field.DisplayName}</span>
                    </div>
                    <div className='col-6 align-self-center'>
                      <input className='form-control' placeholder={field.Field.FieldName} id={field.Field.FieldName} onChange={handleInputChange} />
                    </div>
                    <div className='col-2 align-self-center'>
                      {getValue(field.Field.FieldName).Field.Confident === "true" && <img src={True} alt='trueState' />}
                      {getValue(field.Field.FieldName).Field.Confident === "false" && <img src={False} alt='falseState' />}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className='submit-section align-self-end'>
              <div className='small-text'>
                Wasn’t that easy? With Fetchie, we make information capture this simple.
              </div>
              <div className='big-text'>
                Sign-up for a free account, and start processing documents now!
              </div>
              <div className='account-section'>
                <div className='normal-text'>
                  Activate Your Free Account
                </div>
                <div className='d-flex justify-content-between'>
                  <input type='text' className='from-control account-input' />
                  <button className='btn submit-btn'>Submit</button>
                </div>
                <div className='d-flex'>
                  <div className='align-self-center'>
                    <input className='form-check-input checked' type='checkbox' />
                  </div>
                  <div className='check-text align-self-center'>Activate Your Free Account</div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex-grow-1 pdf-viewer'>
            <div
              style={{
                border: '1px solid rgba(0, 0, 0, 0.3)',
                height: '750px',
              }}
            >
              {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.14.305/build/pdf.worker.min.js">
                <Viewer fileUrl={PDF} plugins={[defaultLayoutPluginInstance]} />
              </Worker> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
