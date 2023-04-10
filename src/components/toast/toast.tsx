
interface Props {
  message: string;
}

const Toast: React.FC<Props> = ({ message }) => {

  return (
    <div className='absolute bottom-5'>
      <div className="max-w-xs bg-red-500 text-sm text-white rounded-md shadow-lg" role="alert">
        <div className="flex p-4">
          {message}
        </div>
      </div>
    </div>
  )
}

export default Toast;