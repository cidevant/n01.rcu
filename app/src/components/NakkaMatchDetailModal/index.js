import { Modal } from 'react-bootstrap';

export default function MatchDetailModal({ close, mid }) {
    return (
        <Modal
            dialogClassName="XL_MODAL"
            style={{ top: 100 }}
            show
            fullscreen={false}
            onHide={close}
        >
            <iframe
                title={`matchDetail-${mid}`}
                width="100%"
                height={window.innerHeight - 250}
                src={`https://n01darts.com/n01/online/history/stats.html?mid=${mid}`}
            />
        </Modal>
    );
}
