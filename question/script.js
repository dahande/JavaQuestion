document.addEventListener('DOMContentLoaded', function () {
    // 答えの表示/非表示を切り替える関数
    function toggleAnswer(event) {
        const answerId = event.target.dataset.answerId;
        const answerElement = document.getElementById(answerId);
        
        if (answerElement.style.display === 'none') {
            answerElement.style.display = 'block';
            event.target.textContent = '答えを隠す';
        } else {
            answerElement.style.display = 'none';
            event.target.textContent = '答えを見る';
        }
    }

    // 各答え表示ボタンにイベントリスナーを追加
    const buttons = document.querySelectorAll('button[data-answer-id]');
    buttons.forEach(button => {
        button.addEventListener('click', toggleAnswer);
    });
});
