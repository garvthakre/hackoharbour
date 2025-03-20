import {Instagram, Linkedin} from 'lucide-react'

const Footer = () => (
  <footer className="bg-zinc-100 text-black">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row w-full justify-between md:px-24 gap-14">
        <div className="booleanai">
          <div className="onlyElement">
          <h2 className='text-4xl font-extrabold font-outfit hover:text-[#243CB6]'>Project Name</h2>
            <p className='my-2 text-gray-600'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum?</p>
            <div className="social-list flex gap-4">
            <Instagram size={20} />
            <Linkedin size={20}/>
            </div>
            
          </div>
        </div>
      <div className='flex flex-col md:flex-row gap-8 md:gap-12'>
        <div className='1st element'>
          <h3 className="text-lg font-semibold mb-4">Product</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-[#243CB6]">Features</a></li>
            <li><a href="#" className="text-gray-600  hover:text-[#243CB6]">Sponsor</a></li>
            <li><a href="#" className="text-gray-600  hover:text-[#243CB6]">About Us</a></li>
          </ul>
        </div>
        <div className='2nd element'>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-600 hover:text-[#243CB6]">Documentation</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#243CB6]">Sponsor</a></li>
            <li><a href="#" className="text-gray-600 hover:text-[#243CB6]">Help Center</a></li>
          </ul>
        </div>
      </div>
      </div>
      <div className="mt-4 pt-6 text-center text-gray-400">
        <p>&copy; 2025. All rights reserved.</p>
      </div>
    </div>
  </footer>
)

export default Footer