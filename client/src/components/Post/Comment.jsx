export default function Comment({ author, content, create_date }) {
    const formatTime = (time) => {
        time = new Date(time)
        let hours = Math.abs(new Date().getTime() - time) / 36e5;
        if (hours < 1) {
            if (hours * 60 < 2) {
                return Math.trunc((hours * 60) * 60) + 's'
            }
            return Math.trunc(hours * 60) + 'min'
        } else if (hours > 24) {
            let date = (new Date(time).toDateString()).split(' ')
            return date[1] + date[2
            ]
        }
        return Math.trunc(hours) + 'h'
    }

    return (
        <div className="comment">
            <div className="comment-header">
                <div className="comment-author">{author.username.replace(/&quot;/g, '"').replace(/&#x27;/g, "'")}</div>
                <div className="comment-date">{formatTime(create_date)}</div>
            </div>
            <div className="comment-content">{content}</div>
        </div>
    )
}