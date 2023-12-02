// Author: xmrazf00

import { Device } from '@components/device'

interface SharingCartProps {
  device: Device;
}

const SharingCart: React.FC<SharingCartProps> = ({ device }) => {


  return (
    <div className="my-2 bg-slate-500 border-solid border-2 rounded flex justify-between items-center" >
        <div className="mx-11">
            <p>Name:   {device.name}</p>
        </div>
        <div className="mx-11">
            <p>Value:   {device.value}</p>
        </div>
    </div>
  )
}

export default SharingCart