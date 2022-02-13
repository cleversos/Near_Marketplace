import { IconLoader } from '../IconLoader';
import './LoadingCircle.scss';

const LoadingCircle = props => {
  return(
    <div className="loading-circle">
      <IconLoader icon='loading' />
    </div>
  )
}

export default LoadingCircle;