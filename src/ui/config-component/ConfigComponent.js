import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import ReactTooltip from 'react-tooltip';
import Constant from '../../service/Constant.js';

import './ConfigComponent.scss';
import '../../style/fa/all.min.css';

const Loading_state = ['login', 'loading', 'done'];
const { Config_type } = Constant;

const ConfigComponent = ({ fbApi, pageData, onChange, onCopyrights, disabled }) => {
  const [configType, setConfigType] = useState(Config_type[0]);
  const configRef = useRef(null);
  const [fileConfig, setFileConfig] = useState(undefined);
  const [selectedRule, setSelectedRule] = useState('0');
  const [availableRules, setAvailableRules] = useState(undefined);
  const [copyrights, setCopyrights] = useState([]);

  const [loadingRule, setLoadingRule] = useState(Loading_state[0]);

  const [config, setConfig] = useState(undefined);

  const onTypeChange = (e) => {
    setConfigType(e.target.value);
  };

  const onCsvChange = (e) => {
    setFileConfig(e.target.files[0]);
  };

  const onRuleChange = (e) => {
    setSelectedRule(e.target.value);
  };

  useEffect(() => {
    (async () => {
      if (!fbApi || !pageData) {
        setLoadingRule(Loading_state[0]);
      } else {
        setLoadingRule(Loading_state[1]);
        // loading rule
        const rules = await fbApi.getPageRules(pageData);
        const copyrights = await fbApi.getPageCopyright(pageData);
        setLoadingRule(Loading_state[2]);
        setAvailableRules(rules);
        setCopyrights(copyrights);
      }
    })();
  }, [pageData, fbApi]);

  useEffect(() => {
    if (selectedRule && selectedRule !== '0' && availableRules && !availableRules.some(r => r.id === selectedRule)) {
      setSelectedRule('0');
    }
  }, [availableRules, selectedRule]);

  useEffect(() => {
    let config = undefined;
    if (configType === Config_type[0] && fileConfig) {
      config = { type: Config_type[0], file: fileConfig, rules: availableRules };
    } else if (configType === Config_type[1] && selectedRule && selectedRule !== '0') {
      config = { type: Config_type[1], rule: availableRules.filter(r => r.id === selectedRule)[0] };
    }
    setConfig(config);
  }, [configType, fileConfig, selectedRule, availableRules]);

  useEffect(() => {
    if (onChange)
      onChange(config);
  }, [config, onChange]);

  useEffect(() => {
    if (onCopyrights)
      onCopyrights(copyrights);
  }, [copyrights, onCopyrights]);

  const configDOM = useMemo(() => {
    if (configType === Config_type[0]) {
      return <div>
        <input type='file' accept='.csv' ref={configRef} onChange={onCsvChange} style={{ display: 'none' }}/>
        <div>
          <Button size='sm' variant='outline-primary' onClick={() => configRef.current.click()} disabled={disabled}>
            {fileConfig ? fileConfig.name : 'Select Config file (*.csv)'}
          </Button>
        </div>
        <small>Download template <a href='/templateFbReference.csv' target='_blank'>HERE</a>!!!</small>
      </div>;
    }

    return <div className='rule'>
      <Form.Control as="select" size='sm' defaultValue={selectedRule} onChange={onRuleChange} disabled={disabled}>
        <option value={'0'}>Choose Copyright Rule...</option>
        {availableRules.map(rule => <option key={rule.id} value={rule.id}>{rule.name}</option>)}
      </Form.Control>
    </div>;
  }, [configType, fileConfig, availableRules, disabled, selectedRule]);

  const mainDOM = useMemo(() => {
    if (loadingRule === Loading_state[0]) {
      return <div>
        Login Facebook account first!
      </div>;
    } else if (loadingRule === Loading_state[1]) {
      return <div>
        Loading Copyright Rule...
      </div>;
    }

    return <>
      <div className='typeContainer'>
        <Form.Control as='select' className='type' defaultValue={configType} size='sm' onChange={onTypeChange} disabled={disabled}>
          <option value={Config_type[0]}>Config CSV</option>
          <option value={Config_type[1]}>Easy Mode</option>
        </Form.Control>
        <i className='fas fa-question-circle' data-tip=''/>
      </div>
      <ReactTooltip place='right'>
        "<b>Config CSV</b>": cấu hình cụ thể cho tùng video một bằng file csv.
        <hr/>
        "<b>Easy Mode</b>": tên video tự động lấy theo tên file và áp dụng 1 rule cho toàn bộ video.
      </ReactTooltip>
      {configDOM}
    </>;
  }, [loadingRule, configDOM, disabled, configType]);

  return <div className='configComponent'>
    {mainDOM}
  </div>;
};

export default ConfigComponent;
