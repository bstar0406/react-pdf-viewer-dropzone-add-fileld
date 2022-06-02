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
import Select from 'react-select'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';

import AddFields from './assets/json/addfields.json';
import GetFields from './assets/json/getfields.json';

import { Viewer, SpecialZoomLevel, Worker } from '@react-pdf-viewer/core';
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { zoomPlugin, RenderZoomInProps, RenderZoomOutProps, RenderCurrentScaleProps } from '@react-pdf-viewer/zoom';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
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
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};


const customStyles = {
  control: base => ({
    ...base,
    height: 32,
    minHeight: 32,
    padding: 0
  })
};

function App() {
  const [fields, setFields] = React.useState([]);
  const [details, setDetails] = React.useState([]);
  const [inputs, setInputs] = React.useState([]);
  const [options, setOptions] = React.useState([]);

  // const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const zoomPluginInstance = zoomPlugin();
    const { CurrentScale, ZoomIn, ZoomOut } = zoomPluginInstance;
  const [numPages, setNumPages] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () =>
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () =>
    setPageNumber(
      pageNumber + 1 >= numPages ? numPages : pageNumber + 1,
    );

  React.useEffect(() => {
    setFields(AddFields.AddFields);
    setDetails(GetFields.GetFields);
    let temp = [];
    GetFields.GetFields.map(item => {
      temp.push({ name: item.Field.FieldName, value: "" })
      return item;
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
    setOptions(tempOptions)
  }, [fields])

  const {
    getRootProps,
    getInputProps,
    open,
    acceptedFiles,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: {
      'text/html': ['.pdf'],
    },
    noClick: true,
    noKeyboard: true,
    maxSize: 2 * 1024 * 1024,
  });

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
      temp.push({ name: item.Field.FieldName, value: item.Field.Value })
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

      if (item.Field.FieldName === e.value) {
        if (item.Field.Required === 'true') item.Field.Required = 'false';
        else item.Field.Required = 'true'
      }
      return item;
    })
    setFields(temp)
  }

  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {Math.round(file.size / 1024)} KBytes
    </li>
  ));

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
                <span className='align-self-end'>Drag file to upload, or &nbsp; </span>
                <span className='browse align-self-end me-2' onClick={open}>Browse</span>
                <span className='tiny-text align-self-end'>Supports .pdf (less than 2MB)</span>
              </div>
              <div>
                {acceptedFileItems}
              </div>
            </div>
          </div>
          <button className='btn btn-primary fetch-btn align-self-center' onClick={() => fetch()}>Fetch</button>
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
            <Select options={options} className='select-field' onChange={(e) => changeOption(e)} isSearchable={false} placeholder="Add Field" controlShouldRenderValue={false} styles={customStyles} components={{
              IndicatorSeparator: () => null
            }} />
          </div>
        </div>
        <div className='d-flex setting'>
          <div className='fields d-flex flex-column'>
            <div className='field-list align-self-start w-100'>
              {inputs && fields.map((field, index) => (
                field.Field.Required === "true" && (
                  <div className='row d-flex mb-2' key={index}>
                    <div className='col-4 align-self-center'>
                      <span className=''>{field.Field.DisplayName}</span>
                    </div>
                    <div className='col-6 align-self-center'>
                      <input className='form-control' value={inputs[index].value} placeholder={field.Field.FieldName} id={field.Field.FieldName} onChange={handleInputChange} />
                    </div>
                    <div className='col-2 align-self-center'>
                      {getValue(field.Field.FieldName).Field.Confident === "true" && <img src={True} alt='trueState' />}
                      {getValue(field.Field.FieldName).Field.Confident === "false" && <img src={False} alt='falseState' />}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className='submit-section align-self-end w-100'>
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
            <div className='pagination-back d-flex'>
              <div className='align-self-center'>
              <span className='me-2 pointer' onClick={goToPrevPage}>{'<'}</span>
              <span className='me-2'>
                {pageNumber} of {numPages}
              </span>
              <span  className='pointer' onClick={goToNextPage}>{'>'}</span>
              </div>
            </div>

            <Document
              file="./assets/pdf/aaa.pdf"
              onLoadSuccess={onDocumentLoadSuccess}
              className='document'
            >
              <Page scale={1.5} pageNumber={pageNumber} className='w-100' />
            </Document>
            {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.14.305/build/pdf.worker.js">
              <div
                style={{
                  height: '750px',
                  width: '100%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  overflow:'hidden'
                }}
              >
                <Viewer
                  fileUrl={'./assets/pdf/aaa.pdf'}
                  plugins={[zoomPlugin]}
                  defaultScale={SpecialZoomLevel.PageFit}
                />
              </div>
            </Worker>
            <div
                style={{
                    alignItems: 'center',
                    backgroundColor: '#eeeeee',
                    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '4px',
                }}
            >
                <div style={{ padding: '0px 2px' }}>
                    <ZoomOut>
                        {(RenderZoomOutProps) => (
                            <button
                                style={{
                                    backgroundColor: '#357edd',
                                    border: 'none',
                                    borderRadius: '4px',
                                    color: '#ffffff',
                                    cursor: 'pointer',
                                    padding: '8px',
                                }}
                                onClick={RenderZoomOutProps.onClick}
                            >
                                Zoom out
                            </button>
                        )}
                    </ZoomOut>
                </div>
                <div style={{ padding: '0px 2px' }}>
                    <CurrentScale>
                        {(RenderCurrentScaleProps) => <>{`${Math.round(RenderCurrentScaleProps.scale * 100)}%`}</>}
                    </CurrentScale>
                </div>
                <div style={{ padding: '0px 2px' }}>
                    <ZoomIn>
                        {(RenderZoomInProps) => (
                            <button
                                style={{
                                    backgroundColor: '#357edd',
                                    border: 'none',
                                    borderRadius: '4px',
                                    color: '#ffffff',
                                    cursor: 'pointer',
                                    padding: '8px',
                                }}
                                onClick={RenderZoomInProps.onClick}
                            >
                                Zoom in
                            </button>
                        )}
                    </ZoomIn>
                </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
