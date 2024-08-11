import React from 'react';
import Toolbar, { Item } from 'devextreme-react/toolbar';
import Button from 'devextreme-react/button';
import './header.scss';

export default function Header({ menuToggleEnabled, title, toggleMenu }) {
  return (
    <header className={'header-component'}>
      <Toolbar className={'header-toolbar'}>
        <Item
          location={'before'}
          cssClass={'header-title'}
          text={title}
          visible={!!title}
        />
        <Item
          location={'after'}
          locateInMenu={'auto'}
        >
          <Button
            width={210}
            height={'100%'}
            stylingMode={'text'}
          >
          </Button>
        </Item>
      </Toolbar>
    </header>
  )
}
