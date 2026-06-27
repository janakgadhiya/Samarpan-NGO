import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaUserGraduate, FaLaptopCode, FaStethoscope, FaFutbol, FaMicroscope, FaChalkboardTeacher } from 'react-icons/fa'

export default function CampaignDetail() {
  const { slug } = useParams()

  // Dynamic campaign data mocking based on slug
  const campaignData = {
    'shiksha-na-ruke': {
      title: 'Shiksha Na Ruke',
      theme: 'emerald',
      storyImage: '/12.jpg', // Reusing an existing public image
      storyTitle: 'Supriya, Mission Education Centre - CLCC Karanjkur, Jharkhand',
      storyText: `"My mother wanted to become a teacher but because of her family's poor financial status, she never got an opportunity. In fact, she has never stepped in a school in her entire life. Today, despite all the challenges we are surrounded with, she ensures that we never give up on our education.\n\nMy parents work on fields, construction sites, shops - wherever they get an opportunity. I haven't told her yet but I want to live her dream. I want to become a teacher. Later in life I want to open a school where mothers like mine can get to study."`,
      interventions: [
        { icon: <FaChalkboardTeacher />, text: 'Primary and Secondary education for children' },
        { icon: <FaStethoscope />, text: 'Regular health check-ups & nutrition support' },
        { icon: <FaUserGraduate />, text: 'Training and capacity building of teachers' },
        { icon: <FaLaptopCode />, text: 'Vocational Education & Skill Training' },
        { icon: <FaFutbol />, text: 'Music, sports, life skills education for socio-emotional well being' },
        { icon: <FaMicroscope />, text: 'STEM learning programmes with government schools' },
      ],
      donationAmounts: [1500, 3000, 6000, 12000],
      donationMessage: 'YOUR DONATION WILL HELP FOR THE EDUCATION OF 1 CHILD FOR 3 MONTHS',
    },
    // Fallback template for other links
    'default': {
      title: 'Make a Difference',
      theme: 'blue',
      storyImage: '/4-1.jpg',
      storyTitle: 'Local Community Health Initiative',
      storyText: `"Access to basic healthcare is a fundamental right. Through local support, we can build robust medical camps and provide life-saving interventions."`,
      interventions: [
        { icon: <FaStethoscope />, text: 'Basic Healthcare' },
      ],
      donationAmounts: [1000, 2500, 5000, 10000],
      donationMessage: 'YOUR DONATION SUPPORTS CRITICAL AID DEPLOYMENT.',
    }
  }

  const data = campaignData[slug] || campaignData['default']

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">

      {/* Dynamic Header */}
      <div className={`bg-${data.theme}-700 pt-32 pb-16 px-6 text-center shadow-inner`}>
        <h1 className="font-heading text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
          {data.title}
        </h1>
      </div>

      <div className="max-w-[1300px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 lg:gap-16">

        {/* LEFT COLUMN: Story & Interventions */}
        <div className="flex-1 space-y-16">

          {/* Story Section */}
          <motion.section initial="hidden" animate="visible" variants={fadeUp}>
            <h2 className="font-heading text-3xl font-black uppercase text-slate-900 mb-8 text-center sm:text-left">
              My Shiksha Story
            </h2>
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100">
              <img src={data.storyImage} alt="Story" className="w-full h-[400px] object-cover" />
              <div className="p-8">
                <h3 className="font-bold text-slate-800 mb-4">{data.storyTitle}</h3>
                <p className="text-slate-600 leading-relaxed font-light whitespace-pre-line italic">
                  {data.storyText}
                </p>
              </div>
            </div>
          </motion.section>

          {/* Key Interventions */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className={`bg-${data.theme}-500 py-6 px-4 text-center rounded-t-3xl -mb-4 relative z-0`}>
              <h2 className="font-heading text-xl md:text-2xl font-black uppercase text-white tracking-widest">
                Key Interventions Under {data.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 relative z-10 bg-slate-200 border border-slate-200">
              {data.interventions.map((item, idx) => (
                <div key={idx} className="bg-white p-8 flex flex-col items-center text-center justify-center min-h-[220px] transition-transform hover:-translate-y-1">
                  <div className={`text-5xl text-${data.theme}-600 mb-6`}>
                    {item.icon}
                  </div>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

        </div>


        {/* RIGHT COLUMN: Sticky Donation Form */}
        <div className="w-full lg:w-[480px]">
          <div className="sticky top-24">
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 md:p-10">

              <div className="text-center mb-8">
                <h2 className="font-heading text-3xl font-black uppercase text-slate-900 mb-2">Support The Cause</h2>
                <h3 className="text-sm font-medium tracking-widest text-[#5c6873] uppercase mb-6">Make A Difference</h3>

                {/* Amount Selectors */}
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  {data.donationAmounts.map((amt) => (
                    <label key={amt} className="flex items-center gap-2 cursor-pointer group">
                      <input type="radio" name="amount" className={`w-4 h-4 text-${data.theme}-600 focus:ring-${data.theme}-500 border-slate-300`} />
                      <span className="text-lg font-medium text-slate-700 group-hover:text-slate-900">₹{amt}</span>
                    </label>
                  ))}
                </div>

                <p className={`text-xs font-bold text-${data.theme}-700 uppercase tracking-wider bg-${data.theme}-50 py-2 rounded-lg`}>
                  {data.donationMessage}
                </p>
              </div>

              {/* Form Fields */}
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <input type="number" placeholder="Other Amount" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium" />

                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Enter Full Name" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                  <input type="email" placeholder="Enter Email ID" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input type="tel" placeholder="Enter Mobile No" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                  <input type="date" placeholder="DOB" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Pan No" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all uppercase" />
                  <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-600">
                    <option>India</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-slate-600">
                    <option>Select State</option>
                    <option>Delhi</option>
                    <option>Maharashtra</option>
                  </select>
                  <input type="text" placeholder="City" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                </div>

                <input type="text" placeholder="Address" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />
                <input type="text" placeholder="Pincode" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all" />

                <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-500 leading-relaxed uppercase tracking-wider font-semibold">
                  *Your contributions are eligible for upto 50% Tax Benefit under section 80G as Samarpan NGO is registered as Non Profit Organization*
                  <br />PAN: AACTS7973C | 80G NUMBER: AACTS7973GF20210
                </div>

                <div className="flex gap-3 items-start mt-4">
                  <input type="checkbox" id="agree" className="mt-1 w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500" required />
                  <label htmlFor="agree" className="text-xs text-slate-500 leading-tight">
                    You agree that Samarpan NGO can reach out to you through Whatsapp/Email/SMS/Phone to provide information of your donation campaigns, 80G receipt etc.
                  </label>
                </div>

                <button type="submit" className={`w-full mt-6 bg-${data.theme}-700 hover:bg-${data.theme}-800 text-white font-bold py-4 rounded-xl uppercase tracking-widest transition-all hover:shadow-lg`}>
                  Proceed to Pay
                </button>

              </form>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  )
}
