import Drawer from 'devextreme-react/drawer';
import ScrollView from 'devextreme-react/scroll-view';
import React, { useRef } from 'react';
import { Header, Footer } from '../../components';
import './side-nav-outer-toolbar.scss';

export default function SideNavOuterToolbar({ title, children }) {
  const scrollViewRef = useRef();

  return (
    <div className={'side-nav-outer-toolbar'}>
      <Header
        className={'layout-header'}
        title={title}
      />

      <div className={'container'}>
        <ScrollView ref={scrollViewRef} className={'layout-body with-footer'}>
          <div className={'content'}>
            {React.Children.map(children, item => {
              return item.type !== Footer && item;
            })}
          </div>
          <div className={'content-block'}>
            {React.Children.map(children, item => {
              return item.type === Footer && item;
            })}
          </div>
        </ScrollView>
      </div>
    </div>
  );
}