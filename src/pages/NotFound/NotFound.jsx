import { Link } from 'react-router-dom';
import { Button } from '../../components';
import styles from './NotFound.module.scss';

const NotFound = () => {
  return (
    <div className={styles.notFoundPage}>
      <div className={styles.container}>
        {/* 404 Illustration */}
        <div className={styles.illustration}>
          <div className={styles.number404}>
            <span className={styles.four}>4</span>
            <span className={styles.zero}>0</span>
            <span className={styles.fourLast}>4</span>
          </div>
          
          {/* Floating elements for visual interest */}
          <div className={styles.floatingElements}>
            <div className={styles.circle}></div>
            <div className={styles.triangle}></div>
            <div className={styles.square}></div>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <h1 className={styles.title}>Oops! Page Not Found</h1>
          <p className={styles.description}>
            The page you're looking for seems to have wandered off into the digital wilderness. 
            Don't worry, even the best explorers sometimes take a wrong turn!
          </p>
          
          {/* Suggestions */}
          <div className={styles.suggestions}>
            <h3 className={styles.suggestionsTitle}>Here's what you can do:</h3>
            <ul className={styles.suggestionsList}>
              <li>Check the URL for any typos</li>
              <li>Go back to the previous page</li>
              <li>Visit our homepage to start fresh</li>
              <li>Use the search feature to find what you need</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <Link to="/">
              <Button variant="primary" size="lg">
                Take Me Home
              </Button>
            </Link>
            
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </div>

        {/* Popular Links */}
        <div className={styles.popularLinks}>
          <h3 className={styles.popularTitle}>Popular Pages</h3>
          <div className={styles.linkGrid}>
            <Link to="/" className={styles.popularLink}>
              <div className={styles.linkIcon}>🏠</div>
              <span>Home</span>
            </Link>
            
            <Link to="/topics" className={styles.popularLink}>
              <div className={styles.linkIcon}>📚</div>
              <span>Topics</span>
            </Link>
            
            <Link to="/login" className={styles.popularLink}>
              <div className={styles.linkIcon}>👤</div>
              <span>Sign In</span>
            </Link>
            
            <Link to="/register" className={styles.popularLink}>
              <div className={styles.linkIcon}>✨</div>
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
