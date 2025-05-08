import { useState, useEffect, ReactNode, useRef } from "react";
import axios from "axios";

const API_ROOT = process.env.REACT_APP_API_URL;

const NotificationsPopup = ({ userinfo } : {userinfo: {role: "USER"|"DISTRICT_COORDINATOR"|"TOPLEVEL_COORDINATOR"|"ADMIN"; districtAdmin: {id: number; name: string;} | null;} | null}) => {
  
  const [notifications, setNotifications] = useState<Array<{id: number; text: string; time: Date; unread: boolean}>>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    refreshNotifications();
  }, [userinfo]);

  // Refresh notifications periodically
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshNotifications();
    }, 60_000);

    // Cleanup on unmount or before re-running this effect
    return () => {
      clearInterval(intervalId);
    };
  }, [userinfo]);

  const refreshNotifications = async (loadN?: number) => {
    try {
      const res = await axios.get(`${API_ROOT}/user/notifications${loadN !== undefined ? '/' + loadN : ''}`);
      setNotifications((res.data as Array<{id: number; text: string; unread: boolean; time: string}>).map((e) => {return {...e, time: new Date(e.time)}}));
    } catch (err: any) {
      setNotifications([]);
    }
  };

  const readNotification = async (id: number) => {
    try {
      const res = await axios.patch(`${API_ROOT}/user/notifications/read/${id}`);
      setNotifications(notifications.map(notification => {if(notification.id === id) return {...notification, unread: false}; return notification}));
      refreshNotifications();
    } catch (err: any) {
    }
  };

  const discardNotification = async (id: number, status: boolean) => {
    try {
      const action = status ? 'accept' : 'discard';
      const res = await axios.patch(`${API_ROOT}/user/notifications/${action}/${id}`);
      refreshNotifications();
    } catch (err: any) {
    }
  };

  const grantAccess = async (notificationId: number, userId: number) => {
    try {
      const res = await axios.patch(`${API_ROOT}/teams/grant/${userId}`);
      discardNotification(notificationId, true);
    } catch (err: any) {
    }
  };

  const markupTranslator = (notificationId: number, input: string) => {
    const grantTeamAccessMatch = input.match(/\[GRANT_ACCESS=(\d+)\]/);
    if (grantTeamAccessMatch) {
      const [beforeTag, afterTag] = input.split(grantTeamAccessMatch[0]);
      const userId = parseInt(grantTeamAccessMatch[1], 10);
      return <>
        {beforeTag}
        <button className="btn btn-sm btn-dark me-1" onClick={(e) => grantAccess(notificationId, userId)}>Przyznaj dostęp</button>
        <button className="btn btn-sm btn-dark" onClick={(e) => discardNotification(notificationId, false)}>Odmów</button>
        {afterTag}
      </>;
    } else {
      return <>{input}</>;
    }
  };

  return (
    <div className="position-relative me-3" ref={dropdownRef}>
      <button type="button" className="btn btn-link text-white p-0" onClick={(e) => setShowNotifications(!showNotifications)}>
        <i className="bi bi-bell-fill" style={{ fontSize: '1.25rem' }}/>
        {notifications.filter(n => n.unread).length > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" />
        )}
      </button>

      {showNotifications && 
        <div className="dropdown-menu dropdown-menu-end show mt-2 end-0"
          style={{
            width: '25rem',
            maxWidth: '25rem',
            right: 0,
            left: 'auto',
            maxHeight: '300px',
            overflowY: 'auto',
            backgroundColor: '#f1f3f5',
            boxShadow: '0 .5rem 1rem rgba(0,0,0,.15)',
          }}
        >
          {notifications.map(({ id, text, time, unread }) => (
            <a key={id} className="dropdown-item d-flex flex-column align-items-start" onClick={(e) => readNotification(id)}
              style={{
                backgroundColor: '#f1f3f5',
                ...(unread ? { backgroundColor: '#fff' } : {}),
                borderBottom: '1px solid #e9ecef',
                textWrap: 'wrap',
              }}
            >
              <span style={{ color: (unread ? '#000000' : undefined) }}>{markupTranslator(id, text)}</span>
              <small style={{ fontSize: '0.7em', color: '#6c757d' }}>
                <strong>{time.toLocaleString('pl', {})}</strong>
              </small>
            </a>
          ))}
          {notifications.length === 0 && <div className="dropdown-item text-center text-primary" style={{'--bs-dropdown-link-hover-bg': '#2b303517', '--bs-dropdown-link-active-bg': '#2b303517'} as React.CSSProperties}>
            Brak powiadomień
          </div>}
          {notifications.length == 10 && <div onClick={(e) => refreshNotifications(50)} className="dropdown-item text-center text-primary" style={{'--bs-dropdown-link-hover-bg': '#2b303517', '--bs-dropdown-link-active-bg': '#2b303517'} as React.CSSProperties}>
            Wczytaj więcej
          </div>}
          {notifications.length == 50 && <div onClick={(e) => refreshNotifications(5000)} className="dropdown-item text-center text-primary" style={{'--bs-dropdown-link-hover-bg': '#2b303517', '--bs-dropdown-link-active-bg': '#2b303517'} as React.CSSProperties}>
            Wczytaj wszystkie
          </div>}
        </div>
      }
    </div>
  );
};

export default NotificationsPopup;
