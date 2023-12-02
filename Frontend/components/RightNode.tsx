// Author: xmrazf00

import React from 'react'
import {Right} from '@components/system'

interface RightNodeProps {
    right: Right;
    onButtonClick: (e: React.SyntheticEvent) => void;
  }

  const RightNode: React.FC<RightNodeProps> = ({ right, onButtonClick}) =>{

  return (
    <>
        {(right === Right.REGISTERED) &&
            <button onClick={onButtonClick}>Apply</button>
        }
        {(right === Right.SHARED) &&
            <p className="text-green-400">Shared</p>
        }
        {(right === Right.WAITING_USER_TO_OWNER) &&
            <p className="text-orange-300">Waiting</p>
        }
        {(right === Right.DECLINED) &&
            <p className="text-red-500">Declined</p>
        }
    </>
  )
}

export default RightNode