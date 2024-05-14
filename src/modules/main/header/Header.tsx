import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  toggleControlSidebar,
  toggleSidebarMenu,
} from '@app/store/reducers/ui';
import MessagesDropdown from '@app/modules/main/header/messages-dropdown/MessagesDropdown';
import NotificationsDropdown from '@app/modules/main/header/notifications-dropdown/NotificationsDropdown';
import LanguagesDropdown from '@app/modules/main/header/languages-dropdown/LanguagesDropdown';
import UserDropdown from '@app/modules/main/header/user-dropdown/UserDropdown';
import { useAppDispatch, useAppSelector } from '@app/store/store';

const Header = () => {
  const [t] = useTranslation();
  const dispatch = useAppDispatch();
  const navbarVariant = useAppSelector((state) => state.ui.navbarVariant);
  const headerBorder = useAppSelector((state) => state.ui.headerBorder);

  const handleToggleMenuSidebar = () => {
    dispatch(toggleSidebarMenu());
  };

  const handleToggleControlSidebar = () => {
    dispatch(toggleControlSidebar());
  };

  const getContainerClasses = useCallback(() => {
    let classes = `main-header navbar navbar-expand ${navbarVariant}`;
    if (headerBorder) {
      classes = `${classes} border-bottom-0`;
    }
    return classes;
  }, [navbarVariant, headerBorder]);

  return (
    <nav className={getContainerClasses()}>
      <ul className="navbar-nav">
        <li className="nav-item">
          <button
            onClick={handleToggleMenuSidebar}
            type="button"
            className="nav-link"
          >
            <i className="fas fa-bars" />
          </button>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to="/" className="nav-link">
            {t('header.label.home')}
          </Link>
        </li>
        <li className="nav-item d-none d-sm-inline-block">
          <Link to="/" className="nav-link">
            {t('header.label.contact')}
          </Link>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <MessagesDropdown />
        <NotificationsDropdown />
        <LanguagesDropdown />
        <UserDropdown />
        <li className="nav-item">
          <button
            type="button"
            className="nav-link"
            onClick={handleToggleControlSidebar}
          >
            <i className="fas fa-th-large" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
